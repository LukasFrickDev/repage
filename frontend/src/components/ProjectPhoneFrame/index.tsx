import styled from 'styled-components';
import { colors } from '../../styles/theme';

type ProjectPhoneFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
};

const Frame = styled.span`
  position: relative;
  width: 100%;
  display: block;
  overflow: hidden;
  padding: 0.75rem 0.5rem 0.6rem;
  background: linear-gradient(135deg, #263246 0%, ${colors.inkDeep} 44%, #111927 100%);
  border: 1px solid rgba(7, 12, 22, 0.92);
  border-radius: 1.5rem;
  box-shadow: 0 1.25rem 2.5rem rgba(16, 24, 39, 0.22), inset 0 0 0 1px rgba(245, 242, 236, 0.16);

  &::before,
  &::after {
    position: absolute;
    left: -0.16rem;
    width: 0.14rem;
    border-radius: 999px 0 0 999px;
    background: #0b1019;
    content: '';
  }

  &::before { top: 20%; height: 11%; }
  &::after { top: 35%; height: 18%; }
`;

const DeviceChrome = styled.span`
  position: absolute;
  top: 0.25rem;
  left: 50%;
  width: 3.15rem;
  height: 0.44rem;
  margin: 0;
  display: block;
  border-radius: 999px;
  background: #070c14;
  box-shadow: inset 0 1px 1px rgba(245, 242, 236, 0.12);
  transform: translateX(-50%);
`;

const Screen = styled.span`
  display: block;
  overflow: hidden;
  aspect-ratio: 195 / 422;
  border: 1px solid rgba(245, 242, 236, 0.14);
  border-radius: 1rem;
  background: #fff;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: top center;
`;

export function ProjectPhoneFrame({ src, alt, width, height, loading = 'lazy' }: ProjectPhoneFrameProps) {
  return (
    <Frame data-project-phone-frame>
      <DeviceChrome aria-hidden="true" />
      <Screen>
        <Image src={src} alt={alt} width={width} height={height} loading={loading} />
      </Screen>
    </Frame>
  );
}
