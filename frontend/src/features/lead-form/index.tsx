import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { createIdempotencyKey, createLead, LeadApiError } from '../../services/api/leads';
import {
  leadFormSchema,
  type LeadFieldName,
  type LeadFormInput,
  type LeadFormValues,
  formatPhoneInput,
  projectTypeOptions,
} from './schema';
import * as S from './styles';
import { ANALYTICS_EVENT_NAMES, trackEvent } from '../../services/analytics';

const fieldOrder: LeadFieldName[] = [
  'name',
  'email',
  'whatsapp',
  'project_type',
  'business_name',
  'message',
  'privacy_policy_acknowledged',
];

const defaultValues: LeadFormValues = {
  name: '',
  email: '',
  whatsapp: '',
  project_type: undefined as never,
  business_name: '',
  message: '',
  privacy_policy_acknowledged: false as never,
  company_website: '',
};

type LeadFormProps = {
  onInteractionStart?: () => void;
};

type ProjectTypeComboboxProps = {
  'aria-describedby'?: string;
  'aria-invalid': boolean;
  name: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  value: string | undefined;
};

function ProjectTypeCombobox({
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  name,
  onBlur,
  onChange,
  value,
}: ProjectTypeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = projectTypeOptions.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? projectTypeOptions[selectedIndex] : undefined;

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const openList = () => {
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const chooseOption = (index: number) => {
    onChange(projectTypeOptions[index].value);
    onBlur();
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) openList();
      else setHighlightedIndex((index) => Math.min(index + 1, projectTypeOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) openList();
      else setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault();
      chooseOption(highlightedIndex);
    } else if ((event.key === 'Enter' || event.key === ' ') && !open) {
      event.preventDefault();
      openList();
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <S.Combobox ref={rootRef}>
      <S.ComboboxButton
        ref={buttonRef}
        id="lead-project-type"
        type="button"
        name={name}
        role="combobox"
        aria-controls="lead-project-type-list"
        aria-activedescendant={open ? `lead-project-type-option-${projectTypeOptions[highlightedIndex].value}` : undefined}
        aria-describedby={ariaDescribedBy}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        aria-label="Tipo de projeto"
        onBlur={onBlur}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
      >
        {selectedOption?.label ?? 'Selecione uma opção'}
      </S.ComboboxButton>
      {open && (
        <S.ComboboxList id="lead-project-type-list" role="listbox" aria-label="Opções de tipo de projeto">
          {projectTypeOptions.map((option, index) => (
            <S.ComboboxOption
              key={option.value}
              id={`lead-project-type-option-${option.value}`}
              role="option"
              aria-selected={option.value === value}
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => chooseOption(index)}
              onMouseEnter={() => setHighlightedIndex(index)}
              data-highlighted={index === highlightedIndex ? 'true' : undefined}
            >
              {option.label}
            </S.ComboboxOption>
          ))}
        </S.ComboboxList>
      )}
    </S.Combobox>
  );
}

export function LeadForm({ onInteractionStart }: LeadFormProps) {
  const [generalError, setGeneralError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const interactionReported = useRef(false);
  const idempotencyKey = useRef<string | null>(null);
  const formStartedAt = useRef(new Date().toISOString());
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<LeadFormInput, unknown, LeadFormValues>({
    defaultValues,
    resolver: zodResolver(leadFormSchema),
    shouldFocusError: false,
  });
  const phoneRegistration = register('whatsapp');

  const focusFirstError = (fieldErrors: typeof errors) => {
    const firstField = fieldOrder.find((field) => fieldErrors[field]);
    if (firstField) setFocus(firstField);
  };

  const onInvalid = (fieldErrors: typeof errors) => {
    setSucceeded(false);
    setSubmitted(true);
    setGeneralError('Revise os campos destacados antes de enviar.');
    trackEvent(ANALYTICS_EVENT_NAMES.leadFormError, { category: 'validation' });
    focusFirstError(fieldErrors);
  };

  const onSubmit = async (values: LeadFormValues) => {
    setGeneralError('');
    setSucceeded(false);
    setSubmitted(true);
    const attemptKey = idempotencyKey.current ?? createIdempotencyKey();
    idempotencyKey.current = attemptKey;
    try {
      await createLead(values, {
        idempotencyKey: attemptKey,
        formStartedAt: formStartedAt.current,
      });
      trackEvent(ANALYTICS_EVENT_NAMES.leadFormSuccess);
      setSucceeded(true);
      idempotencyKey.current = null;
      formStartedAt.current = new Date().toISOString();
      reset();
    } catch (error) {
      if (error instanceof LeadApiError) {
        const category = error.code === 'idempotency_conflict'
          ? 'idempotency_conflict'
          : error.status === 429
            ? 'rate_limited'
            : error.status === 503
              ? 'service_unavailable'
              : error.fields || error.code === 'validation_error'
                ? 'validation'
                : error.status >= 500
                  ? 'server'
                  : 'server';
        trackEvent(ANALYTICS_EVENT_NAMES.leadFormError, { category });
        if (error.code === 'idempotency_conflict') {
          idempotencyKey.current = null;
          setGeneralError('Esta tentativa já foi usada com dados diferentes. Revise o formulário e envie novamente.');
          return;
        }
        if (error.code === 'privacy_policy_version_mismatch') {
          setGeneralError('A Política de Privacidade foi atualizada. Recarregue esta página e revise o formulário antes de tentar novamente.');
          return;
        }
        Object.entries(error.fields ?? {}).forEach(([field, messages]) => {
          if (fieldOrder.includes(field as LeadFieldName)) {
            setError(field as LeadFieldName, { type: 'server', message: messages[0] });
          }
        });
        setGeneralError(error.fields ? 'Revise os campos informados.' : error.message);
      } else {
        trackEvent(ANALYTICS_EVENT_NAMES.leadFormError, { category: 'network' });
        setGeneralError('Não foi possível confirmar o envio. Verifique sua conexão e tente novamente quando desejar.');
      }
    }
  };

  return (
    <>
      <S.Form
        aria-labelledby="lead-form-title"
        noValidate
        onFocusCapture={() => {
          if (!interactionReported.current) {
            interactionReported.current = true;
            onInteractionStart?.();
          }
        }}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
      >
        <S.Heading id="lead-form-title">Solicitar orçamento</S.Heading>
        <S.Honeypot
          aria-hidden="true"
          autoComplete="off"
          tabIndex={-1}
          type="text"
          {...register('company_website')}
        />
        {isSubmitted && submitted && Object.keys(errors).length > 0 && (
          <S.ErrorSummary role="alert" aria-live="assertive">
            Revise os campos destacados antes de enviar.
          </S.ErrorSummary>
        )}
        <S.Fields>
          <S.Field>
            <S.Label htmlFor="lead-name">Nome</S.Label>
            <S.Input
              id="lead-name"
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'lead-name-error' : undefined}
              {...register('name')}
            />
            {errors.name && <S.Error id="lead-name-error">{errors.name.message}</S.Error>}
          </S.Field>
          <S.Field>
            <S.Label htmlFor="lead-email">E-mail</S.Label>
            <S.Input
              id="lead-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'lead-email-error' : undefined}
              {...register('email')}
            />
            {errors.email && <S.Error id="lead-email-error">{errors.email.message}</S.Error>}
          </S.Field>
          <S.Field>
            <S.Label htmlFor="lead-whatsapp">Telefone</S.Label>
            <S.Input
              id="lead-whatsapp"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={15}
              aria-invalid={Boolean(errors.whatsapp)}
              aria-describedby={errors.whatsapp ? 'lead-whatsapp-error' : undefined}
              {...phoneRegistration}
              onChange={(event) => {
                event.target.value = formatPhoneInput(event.target.value);
                void phoneRegistration.onChange(event);
              }}
            />
            {errors.whatsapp && <S.Error id="lead-whatsapp-error">{errors.whatsapp.message}</S.Error>}
          </S.Field>
          <S.Field>
            <S.Label htmlFor="lead-project-type">Tipo de projeto</S.Label>
            <Controller
              control={control}
              name="project_type"
              render={({ field }) => (
                <ProjectTypeCombobox
                  aria-describedby={errors.project_type ? 'lead-project-type-error' : undefined}
                  aria-invalid={Boolean(errors.project_type)}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            {errors.project_type && <S.Error id="lead-project-type-error">{errors.project_type.message}</S.Error>}
          </S.Field>
          <S.Field $wide>
            <S.Label htmlFor="lead-business-name">Marca, negócio ou projeto</S.Label>
            <S.Input
              id="lead-business-name"
              autoComplete="organization"
              maxLength={160}
              aria-invalid={Boolean(errors.business_name)}
              aria-describedby={errors.business_name ? 'lead-business-name-error' : undefined}
              {...register('business_name')}
            />
            {errors.business_name && <S.Error id="lead-business-name-error">{errors.business_name.message}</S.Error>}
          </S.Field>
          <S.Field $wide>
            <S.Label htmlFor="lead-message">Conte um pouco sobre o que você precisa</S.Label>
            <S.Textarea
              id="lead-message"
              maxLength={4000}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'lead-message-error' : undefined}
              {...register('message')}
            />
            {errors.message && <S.Error id="lead-message-error">{errors.message.message}</S.Error>}
          </S.Field>
        </S.Fields>
        <S.CheckboxRow>
          <S.Checkbox
            id="lead-privacy"
            type="checkbox"
            aria-invalid={Boolean(errors.privacy_policy_acknowledged)}
            aria-describedby={errors.privacy_policy_acknowledged ? 'lead-privacy-error' : undefined}
            {...register('privacy_policy_acknowledged')}
          />
          <S.CheckboxLabel htmlFor="lead-privacy">
            Li e estou ciente da <Link to="/privacidade">Política de Privacidade</Link>.
            {errors.privacy_policy_acknowledged && <S.Error id="lead-privacy-error">{errors.privacy_policy_acknowledged.message}</S.Error>}
          </S.CheckboxLabel>
        </S.CheckboxRow>
        <S.Actions>
          <S.Submit type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? 'Enviando…' : 'Solicitar orçamento'}
          </S.Submit>
          {generalError && <S.Status role="alert" aria-live="assertive">{generalError}</S.Status>}
          {succeeded && !generalError && (
            <S.Status $success role="status" aria-live="polite">
              <strong>Solicitação recebida.</strong> Obrigado por entrar em contato com a Repage. Você deve receber uma confirmação por e-mail nos próximos minutos. Se não encontrar, confira também a pasta de <strong>Spam</strong> ou <strong>Lixo eletrônico</strong>.
            </S.Status>
          )}
        </S.Actions>
        <S.DirectContact>
          <span>Prefere falar diretamente?</span>
          <S.WhatsAppLink
            href={`https://wa.me/5511958244081?text=${encodeURIComponent('Olá! Conheci a Repage pelo site e gostaria de conversar sobre um projeto.')}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent(ANALYTICS_EVENT_NAMES.whatsappClick)}
          >
            Falar pelo WhatsApp
          </S.WhatsAppLink>
        </S.DirectContact>
      </S.Form>
    </>
  );
}
