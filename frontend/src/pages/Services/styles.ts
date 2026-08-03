import styled from 'styled-components';
import { colors, fonts, breakpoints } from '../../styles/globalStyles';

export const TitleBox = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fade-in 1s;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  font-family: ${fonts.heading};
  color: ${colors.white};
  @media (min-width: ${breakpoints.tablet}) {
    font-size: 3.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${colors.textSecondary};
  max-width: 32rem;
  margin: 0 auto;
  font-family: ${fonts.primary};
`;

export const Grid = styled.div<{ $variant?: 'default' | 'diferencial' }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: ${(props) =>
      props.$variant === 'diferencial' ? '1fr 1fr' : '1fr 1fr 1fr'};
    margin-bottom: ${(props) =>
      props.$variant === 'diferencial' ? '4rem' : '0'};
  }
`;

export const DifferentialsBox = styled.div`
  background: linear-gradient(135deg, #121217, #0b0b10);
  border: 1px solid #2d2d35;
  border-radius: 14px;
  padding: 2.5rem 1.5rem 1.5rem;
  box-shadow:
    0 0 0 1px #1f1f25,
    0 8px 32px -12px #000;
  backdrop-filter: blur(6px);
`;

export const DifferentialsList = styled.ul`
  list-style: none;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
`;

export const DifferentialItem = styled.li`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 1.1rem;
  font-size: 0.9rem;
  color: #fff;
`;

export const DifferentialDot = styled.span`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #6d28d9, #0ea5e9);
  box-shadow: 0 0 8px #6d28d9;
`;

export const CTABox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
  padding: 1.5rem;
`;

export const CTATitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: 1.6rem;
  margin: 0;
  color: #fff;
`;

export const CTADesc = styled.p`
  color: #9ca3af;
  font-size: 0.95rem;
  line-height: 1.4;
`;
