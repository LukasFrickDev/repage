import * as S from './styles';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'default',
  children,
  ...props
}: ButtonProps) {
  return (
    <S.ButtonContent variant={variant} size={size} {...props}>
      {children}
    </S.ButtonContent>
  );
}

// usei React.ButtonHTMLAttributes<HTMLButtonElement> para que o componente aceite todas as props nativas de um <button> (como onClick, disabled, type etc.), mantendo tipagem forte com TypeScript.
