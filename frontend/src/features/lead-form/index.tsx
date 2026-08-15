import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { createLead, LeadApiError } from '../../services/api/leads';
import {
  leadFormSchema,
  type LeadFieldName,
  type LeadFormInput,
  type LeadFormValues,
  projectTypeOptions,
} from './schema';
import * as S from './styles';

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
};

export function LeadForm() {
  const [generalError, setGeneralError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const {
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

  const focusFirstError = (fieldErrors: typeof errors) => {
    const firstField = fieldOrder.find((field) => fieldErrors[field]);
    if (firstField) setFocus(firstField);
  };

  const onInvalid = (fieldErrors: typeof errors) => {
    setSubmitted(true);
    setGeneralError('Revise os campos destacados antes de enviar.');
    focusFirstError(fieldErrors);
  };

  const onSubmit = async (values: LeadFormValues) => {
    setGeneralError('');
    setSubmitted(true);
    try {
      await createLead(values);
      setSucceeded(true);
      reset();
    } catch (error) {
      if (error instanceof LeadApiError) {
        Object.entries(error.fields ?? {}).forEach(([field, messages]) => {
          if (fieldOrder.includes(field as LeadFieldName)) {
            setError(field as LeadFieldName, { type: 'server', message: messages[0] });
          }
        });
        setGeneralError(error.fields ? 'Revise os campos informados.' : error.message);
      } else {
        setGeneralError('Não foi possível confirmar o envio. Verifique sua conexão e tente novamente quando desejar.');
      }
    }
  };

  return (
    <>
      <S.Form aria-labelledby="lead-form-title" noValidate onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <S.Heading id="lead-form-title">Solicitar orçamento</S.Heading>
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
            <S.Label htmlFor="lead-whatsapp">WhatsApp</S.Label>
            <S.Input
              id="lead-whatsapp"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={32}
              aria-invalid={Boolean(errors.whatsapp)}
              aria-describedby={errors.whatsapp ? 'lead-whatsapp-error' : undefined}
              {...register('whatsapp')}
            />
            {errors.whatsapp && <S.Error id="lead-whatsapp-error">{errors.whatsapp.message}</S.Error>}
          </S.Field>
          <S.Field>
            <S.Label htmlFor="lead-project-type">Tipo de projeto</S.Label>
            <S.Select
              id="lead-project-type"
              aria-invalid={Boolean(errors.project_type)}
              aria-describedby={errors.project_type ? 'lead-project-type-error' : undefined}
              {...register('project_type')}
            >
              <option value="">Selecione uma opção</option>
              {projectTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </S.Select>
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
        </S.Actions>
      </S.Form>
      {succeeded && (
        <S.Success role="status" aria-live="polite">
          <p>Solicitação recebida. Obrigado por entrar em contato com a Repage.</p>
        </S.Success>
      )}
    </>
  );
}
