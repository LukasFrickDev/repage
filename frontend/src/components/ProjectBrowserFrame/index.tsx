import styled from 'styled-components';
import { breakpoints, colors, homepageTokens } from '../../styles/theme';

type ProjectBrowserFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
  listing?: boolean;
  gallery?: boolean;
};

const Frame = styled.span<{ $listing: boolean; $gallery: boolean }>`
  position: ${({ $listing }) => ($listing ? 'relative' : 'absolute')};
  z-index: 1;
  ${({ $listing }) => ($listing ? 'width: 100%;' : `left: calc(50% - ${homepageTokens.projects.mediaCompositionShift});`)}
  ${({ $listing, $gallery }) => ($listing
    ? ($gallery ? 'aspect-ratio: auto;' : `aspect-ratio: ${homepageTokens.projects.browser.aspectRatio};`)
    : `top: 50%; height: ${homepageTokens.projects.browser.height}; max-width: ${homepageTokens.projects.browser.maxWidth}; aspect-ratio: ${homepageTokens.projects.browser.aspectRatio};`)}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ $gallery }) => ($gallery ? '#101827' : colors.inkDeep)};
  border: ${({ $gallery }) => ($gallery ? '1px solid rgba(16, 24, 39, 0.72)' : '1px solid rgba(245, 242, 236, 0.18)')};
  border-radius: ${({ $gallery }) => ($gallery ? 'clamp(0.7rem, 1vw, 1rem)' : 'clamp(0.55rem, 0.9vw, 0.85rem)')};
  box-shadow: ${({ $gallery }) => ($gallery ? '0 1.5rem 3.75rem rgba(4, 8, 17, 0.28), 0 0 0 0.2rem rgba(16, 24, 39, 0.08)' : '0 2rem 5rem rgba(4, 8, 17, 0.34)')};
  ${({ $listing }) => ($listing ? '' : 'transform: translate(-50%, -50%);')}
  transition: transform 360ms ease;

  a:hover & {
    transform: ${({ $listing }) => ($listing ? 'scale(1.006)' : 'translate(-50%, -50%) scale(1.006)')};
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    ${({ $listing }) => ($listing ? '' : `left: 50%; width: ${homepageTokens.projects.browser.compactWidth}; height: auto; max-width: none; aspect-ratio: ${homepageTokens.projects.browser.compactAspectRatio};`)}
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const Bar = styled.span<{ $gallery: boolean }>`
  flex: 0 0 clamp(1.85rem, 2.6vw, 2.35rem);
  padding-inline: clamp(0.55rem, 1vw, 0.85rem);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  background: ${({ $gallery }) => ($gallery ? '#202b3d' : colors.inkHeader)};
  border-bottom: 1px solid ${({ $gallery }) => ($gallery ? 'rgba(245, 242, 236, 0.18)' : 'rgba(245, 242, 236, 0.12)')};

  @media (max-width: ${breakpoints.tabletMax}) { flex-basis: 1.5rem; }
`;

const WindowControls = styled.span`
  display: flex;
  gap: 0.3rem;

  i {
    width: 0.42rem;
    aspect-ratio: 1;
    border: 1px solid rgba(245, 242, 236, 0.28);
    border-radius: 50%;
    background: rgba(245, 242, 236, 0.08);
  }

  i:first-child { border-color: rgba(108, 99, 255, 0.7); }

  @media (max-width: ${breakpoints.tabletMax}) {
    gap: 0.2rem;
    i { width: 0.3rem; }
  }
`;

const AddressHint = styled.span`
  grid-column: 2;
  justify-self: center;
  width: min(52%, 18rem);
  height: 0.62rem;
  border: 1px solid rgba(245, 242, 236, 0.18);
  border-radius: 999px;
  background: rgba(245, 242, 236, 0.09);
`;

const Viewport = styled.span<{ $gallery: boolean }>`
  min-height: 0;
  flex: ${({ $gallery }) => ($gallery ? '0 0 auto' : '1')};
  display: block;
  overflow: hidden;
  ${({ $gallery }) => ($gallery ? 'aspect-ratio: 16 / 10;' : '')}
`;

const Image = styled.img<{ $gallery: boolean }>`
  width: 100%;
  height: ${({ $gallery }) => ($gallery ? '100%' : '100%')};
  display: block;
  object-fit: cover;
  object-position: ${({ $gallery }) => ($gallery ? 'top center' : 'center')};
`;

export function ProjectBrowserFrame({ listing = false, gallery = false, ...imageProps }: ProjectBrowserFrameProps) {
  return (
    <Frame $listing={listing} $gallery={gallery} data-project-browser-frame={gallery ? '' : undefined}>
      <Bar $gallery={gallery} aria-hidden="true">
        <WindowControls><i /><i /><i /></WindowControls>
        <AddressHint />
      </Bar>
      <Viewport $gallery={gallery}>
        <Image $gallery={gallery} {...imageProps} />
      </Viewport>
    </Frame>
  );
}
