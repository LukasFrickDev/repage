import styled from 'styled-components';
import { breakpoints, colors, homepageTokens } from '../../styles/theme';

type ProjectBrowserFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
  listing?: boolean;
};

const Frame = styled.span<{ $listing: boolean }>`
  position: ${({ $listing }) => ($listing ? 'relative' : 'absolute')};
  z-index: 1;
  ${({ $listing }) => ($listing ? 'width: 100%;' : `left: calc(50% - ${homepageTokens.projects.mediaCompositionShift});`)}
  ${({ $listing }) => ($listing ? `aspect-ratio: ${homepageTokens.projects.browser.aspectRatio};` : `top: 50%; height: ${homepageTokens.projects.browser.height}; max-width: ${homepageTokens.projects.browser.maxWidth}; aspect-ratio: ${homepageTokens.projects.browser.aspectRatio};`)}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${colors.inkDeep};
  border: 1px solid rgba(245, 242, 236, 0.18);
  border-radius: clamp(0.55rem, 0.9vw, 0.85rem);
  box-shadow: 0 2rem 5rem rgba(4, 8, 17, 0.34);
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

const Bar = styled.span`
  flex: 0 0 clamp(1.85rem, 2.6vw, 2.35rem);
  padding-inline: clamp(0.55rem, 1vw, 0.85rem);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  background: ${colors.inkHeader};
  border-bottom: 1px solid rgba(245, 242, 236, 0.12);

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
  height: 0.48rem;
  border: 1px solid rgba(245, 242, 236, 0.12);
  border-radius: 999px;
  background: rgba(245, 242, 236, 0.035);
`;

const Viewport = styled.span`
  min-height: 0;
  flex: 1;
  display: block;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
`;

export function ProjectBrowserFrame({ listing = false, ...imageProps }: ProjectBrowserFrameProps) {
  return (
    <Frame $listing={listing}>
      <Bar aria-hidden="true">
        <WindowControls><i /><i /><i /></WindowControls>
        <AddressHint />
      </Bar>
      <Viewport>
        <Image {...imageProps} />
      </Viewport>
    </Frame>
  );
}
