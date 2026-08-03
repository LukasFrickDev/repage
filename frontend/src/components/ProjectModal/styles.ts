import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, fonts, breakpoints } from '../../styles/globalStyles';

export const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-family: ${fonts.primary};
  font-weight: 600;
  color: ${colors.highlight};
  background: none;
  border: none;
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  transition:
    background 0.2s,
    color 0.2s;
  cursor: pointer;
  &:hover {
    background: ${colors.highlight};
    color: ${colors.white};
  }
`;

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${colors.background}CC;
  backdrop-filter: blur(6px);
  z-index: 50;
`;

export const ModalWrapper = styled(motion.div)`
  position: fixed;
  inset: 1rem;
  z-index: 51;
  overflow: hidden;
  @media (min-width: ${breakpoints.tablet}) {
    inset: 2rem;
  }
  @media (min-width: ${breakpoints.desktop}) {
    inset: 4rem;
  }
`;

export const Modal = styled.div`
  background: ${colors.backgroundSecondary};
  border: 2px solid ${colors.gridLine};
  border-radius: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.25);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.gridLine};
`;

export const ModalTitle = styled.h2`
  font-size: 2rem;
  font-family: ${fonts.heading};
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

export const MainImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 0.75rem;
  overflow: hidden;
  background: ${colors.gridLine};
`;

export const Gallery = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

export const GalleryButton = styled.button<{ $active?: boolean }>`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
  border: none;
  outline: none;
  transition:
    box-shadow 0.2s,
    opacity 0.2s,
    transform 0.2s;
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  box-shadow: ${({ $active }) =>
    $active ? `0 0 0 2px ${colors.highlight}` : 'none'};
  transform: ${({ $active }) => ($active ? 'scale(1.05)' : 'scale(1)')};
  &:hover {
    opacity: 1;
  }
`;

export const DescriptionBox = styled.div`
  margin-top: 2rem;
`;

export const ModalSectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const ModalText = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.7;
`;

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1.5rem;
`;
