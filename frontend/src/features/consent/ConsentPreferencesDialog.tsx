import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useConsent } from './useConsent';
import * as S from './styles';

export function ConsentPreferencesDialog() {
  const {
    preference,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    closePreferences,
  } = useConsent();
  const [analytics, setAnalytics] = useState(preference.analytics);
  const [advertising, setAdvertising] = useState(preference.advertising);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(document.activeElement instanceof HTMLElement ? document.activeElement : null);

  useEffect(() => {
    const returnFocusElement = returnFocusRef.current;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusElement?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePreferences();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href]',
      )];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closePreferences]);

  const save = () => savePreferences({ analytics, advertising });

  const handleBackdropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.key === 'Escape') closePreferences();
  };

  return (
    <S.DialogBackdrop onKeyDown={handleBackdropKeyDown}>
      <S.Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-dialog-title"
        aria-describedby="consent-dialog-description"
      >
        <S.DialogHeader>
          <div>
            <S.DialogEyebrow>Privacidade</S.DialogEyebrow>
            <S.DialogTitle id="consent-dialog-title">Preferências de cookies</S.DialogTitle>
          </div>
          <S.CloseButton ref={closeButtonRef} type="button" onClick={closePreferences} aria-label="Fechar preferências">
            ×
          </S.CloseButton>
        </S.DialogHeader>
        <S.DialogDescription id="consent-dialog-description">
          Escolha quais categorias não essenciais podem ser ativadas. Você pode revisar essa decisão a qualquer momento.
        </S.DialogDescription>

        <S.CategoryList>
          <S.Category>
            <S.CategoryText>
              <S.CategoryTitle>Necessários</S.CategoryTitle>
              <S.CategoryDescription>Funcionam para segurança, navegação e preferências essenciais do site. Sempre ativos e não editáveis.</S.CategoryDescription>
            </S.CategoryText>
            <S.RequiredStatus aria-label="Necessários sempre ativos">Obrigatórios</S.RequiredStatus>
          </S.Category>
          <S.Category>
            <S.CategoryText>
              <S.CategoryTitle>Analíticos</S.CategoryTitle>
              <S.CategoryDescription>Ajudam a entender o uso do site via Google Analytics, sem dados do formulário.</S.CategoryDescription>
            </S.CategoryText>
            <S.SwitchLabel>
              <span>Permitir Analíticos</span>
              <S.Switch type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            </S.SwitchLabel>
          </S.Category>
          <S.Category>
            <S.CategoryText>
              <S.CategoryTitle>Publicitários</S.CategoryTitle>
              <S.CategoryDescription>Nenhuma tecnologia publicitária está ativa atualmente. Esta preferência fica preparada para o futuro.</S.CategoryDescription>
            </S.CategoryText>
            <S.SwitchLabel>
              <span>Permitir Publicitários</span>
              <S.Switch type="checkbox" checked={advertising} onChange={(event) => setAdvertising(event.target.checked)} />
            </S.SwitchLabel>
          </S.Category>
        </S.CategoryList>

        <S.DialogActions>
          <S.SecondaryButton type="button" onClick={rejectNonEssential}>Rejeitar não essenciais</S.SecondaryButton>
          <S.SecondaryButton type="button" onClick={acceptAll}>Aceitar todos</S.SecondaryButton>
          <S.PrimaryButton type="button" onClick={save}>Salvar preferências</S.PrimaryButton>
        </S.DialogActions>
      </S.Dialog>
    </S.DialogBackdrop>
  );
}
