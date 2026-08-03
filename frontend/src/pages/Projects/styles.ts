import styled from 'styled-components';
import { motion } from 'framer-motion';
// Motion wrappers for animated sections

// Search bar and filter layout
export const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: ${colors.textSecondary};
  pointer-events: none;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.gridLine};
  background: ${colors.backgroundSecondary};
  color: ${colors.white};
  font-size: 1rem;
  font-family: ${fonts.primary};
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: ${colors.highlight};
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
  &:hover {
    color: ${colors.white};
  }
`;

interface FilterButtonProps {
  $active?: boolean;
}
export const FilterButton = styled.button<FilterButtonProps>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.gridLine};
  background: ${({ $active }) =>
    $active ? colors.highlightStrong : colors.backgroundSecondary};
  color: ${colors.white};
  font-size: 1rem;
  font-family: ${fonts.primary};
  cursor: pointer;
  transition:
    border 0.2s,
    background 0.2s;
  &:hover {
    border-color: ${colors.highlight};
    background: ${colors.highlight};
  }
`;
export const FiltersMotion = styled(motion.div)`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  border-radius: 0.75rem;
  border: 1px solid ${colors.gridLine};
  padding: 1rem;
  margin-bottom: 2rem;
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  h3 {
    font-size: 1rem;
    font-weight: 600;
    font-family: ${fonts.heading};
    color: ${colors.white};
    margin: 0;
  }
`;

export const FiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const HeaderMotion = styled(motion.div)`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
`;

export const SearchMotion = styled(motion.div)`
  max-width: 32rem;
  margin: 0 auto 3rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProjectsGridMotion = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const ProjectCardMotion = styled(motion.div)`
  /* Card animation wrapper, no extra styles needed */
`;

export const EmptyMotion = styled(motion.div)`
  text-align: center;
  padding: 5rem 0;
  color: ${colors.textSecondary};
  font-size: 1.125rem;
`;
import { colors, fonts, breakpoints } from '../../styles/globalStyles';

export const Wrapper = styled.div`
  min-height: 100vh;
  background: ${colors.background};
`;

export const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 1rem;
  @media (max-width: ${breakpoints.tablet}) {
    padding: 3rem 1rem;
  }
`;

export const TitleBox = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
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

export const Form = styled.form`
  max-width: 32rem;
  margin: 0 auto 3rem auto;
`;

export const LoaderBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const ErrorBox = styled.div`
  text-align: center;
  color: ${colors.highlightStrong};
  margin-bottom: 2rem;
`;

export const EmptyBox = styled.div`
  text-align: center;
  padding: 5rem 0;
  color: ${colors.textSecondary};
  font-size: 1.125rem;
`;
