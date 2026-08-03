import { Circle } from 'lucide-react';
import * as S from './styles';
import { Button } from '../Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '../../styles/globalStyles';

interface ElegantShapeProps {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  left,
  right,
  top,
  bottom,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient,
}: ElegantShapeProps) {
  return (
    <S.ElegantShapeContainer
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: [0.23, 0.86, 0.39, 0.96] as any,
        opacity: { duration: 1.2 },
      }}
      left={left}
      right={right}
      top={top}
      bottom={bottom}
      width={width}
      height={height}
      rotate={rotate}
    >
      <S.ElegantShapeInner
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      >
        <S.ElegantShapeBg gradient={gradient} />
      </S.ElegantShapeInner>
    </S.ElegantShapeContainer>
  );
}

interface HeroGeometricProps {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
}

function HeroGeometric({
  badge,
  title1,
  title2,
  subtitle,
}: HeroGeometricProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (to: string) => {
    if (location.pathname !== to) navigate(to);
  };
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: [0.25, 0.4, 0.25, 1] as any,
      },
    }),
  };

  return (
    <S.HeroWrapper>
      <S.BgGradient />
      <S.ShapesWrapper>
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient={`linear-gradient(90deg, #6D28D9 0%, transparent 100%)`}
          left="-10%"
          top="15%"
          // responsividade pode ser ajustada via media queries no styled
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient={`linear-gradient(90deg, #38bdf8cc 0%, transparent 100%)`}
          right="-5%"
          top="70%"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient={`linear-gradient(90deg, #38bdf8cc 0%, transparent 100%)`}
          left="5%"
          bottom="5%"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient={`linear-gradient(90deg, #7C3AED 0%, transparent 100%)`}
          right="15%"
          top="10%"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient={`linear-gradient(90deg, #06b6d4 0%, transparent 100%)`}
          left="20%"
          top="5%"
        />
      </S.ShapesWrapper>

      <S.ContentContainer>
        <S.CenteredText>
          <S.Badge
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <Circle style={{ width: 8, height: 8, fill: colors.highlight }} />
            <S.BadgeText>{badge}</S.BadgeText>
          </S.Badge>

          <S.Title
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <S.TitleGradient>{title1}</S.TitleGradient>
            <br />
            <S.TitleGradient2>{title2}</S.TitleGradient2>
          </S.Title>

          <S.Description
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            {subtitle}
          </S.Description>
          <S.ButtonsContainer
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="secondary"
              onClick={() => handleLinkClick('/about')}
            >
              Sobre a Nexory
            </Button>
            <Button variant="glow" onClick={() => handleLinkClick('/projects')}>
              Portifólio
            </Button>
          </S.ButtonsContainer>
        </S.CenteredText>
      </S.ContentContainer>

      <S.OverlayGradient />
    </S.HeroWrapper>
  );
}

export { HeroGeometric };
