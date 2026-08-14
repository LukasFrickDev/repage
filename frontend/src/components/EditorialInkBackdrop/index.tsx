import styled from 'styled-components';
import { breakpoints, layout } from '../../styles/theme';

const Backdrop = styled.span<{ $compact: boolean }>`
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;

  &::before {
    position: absolute;
    right: ${({ $compact }) => ($compact ? '-5rem' : '-6rem')};
    bottom: ${({ $compact }) => ($compact ? '-8rem' : '-12rem')};
    width: min(${({ $compact }) => ($compact ? '32rem' : '38rem')}, 50vw);
    aspect-ratio: 1;
    content: '';
    border: 1px solid rgba(145, 168, 255, 0.16);
    border-radius: 50%;
    box-shadow: 0 0 0 5rem rgba(108, 99, 255, 0.025), 0 0 0 10rem rgba(108, 99, 255, 0.018);
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    &::before {
      right: -4rem;
      bottom: ${({ $compact }) => ($compact ? '-7rem' : '-9rem')};
      width: min(30rem, 76vw);
    }
  }
`;

const Signal = styled.span<{ $compact: boolean }>`
  position: absolute;
  top: 0;
  left: ${layout.containerPaddingInline};
  width: min(16rem, 28vw);
  height: ${({ $compact }) => ($compact ? '4.5rem' : '5.5rem')};
  border-bottom: 1px solid rgba(145, 168, 255, 0.18);
  border-left: 1px solid rgba(145, 168, 255, 0.35);
  opacity: 0.72;
`;

export function EditorialInkBackdrop({ compact = false }: { compact?: boolean }) {
  return (
    <Backdrop $compact={compact} aria-hidden="true">
      <Signal $compact={compact} />
    </Backdrop>
  );
}
