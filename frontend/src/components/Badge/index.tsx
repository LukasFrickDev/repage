import * as S from './styles';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, variant = 'default', onClick }: BadgeProps) {
  return (
    <S.Badge $variant={variant} onClick={onClick}>
      {children}
    </S.Badge>
  );
}
