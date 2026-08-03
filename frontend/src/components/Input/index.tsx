import * as S from './styles';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return <S.Input {...props} />;
}
