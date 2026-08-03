import * as S from './styles';
import type { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
}

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  features = [],
}: ServiceCardProps) => {
  return (
    <S.Card>
      <S.CardHeader>
        <S.IconWrapper>
          <Icon />
        </S.IconWrapper>
        <S.CardTitle>{title}</S.CardTitle>
      </S.CardHeader>
      <S.CardContent>
        <S.CardDescription>{description}</S.CardDescription>
        {features.length > 0 && (
          <S.FeaturesList>
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </S.FeaturesList>
        )}
      </S.CardContent>
    </S.Card>
  );
};
