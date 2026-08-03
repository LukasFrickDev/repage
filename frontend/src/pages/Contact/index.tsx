import { Button } from '../../components/Button';
import logo from '../../assets/logo.png';

import {
  Mail,
  Github,
  Linkedin,
  MessageCircle,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import * as S from './styles';
import { Header } from '../../components/Header';
import { Footer as FooterGlobal } from '../../components/Footer';

const contactChannels = [
  {
    label: 'Email',
    value: 'contato@nexory.com.br',
    helper: 'Retorno em até 12h úteis',
    href: 'mailto:contato@nexory.com.br',
    icon: Mail,
    external: false,
  },
  {
    label: 'WhatsApp',
    value: '+55 11 99999-9999',
    helper: 'Atendimento rápido e alinhamentos em tempo real',
    href: 'https://wa.me/5511999999999',
    icon: MessageCircle,
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/nexory',
    helper: 'Conexões, parcerias e oportunidades',
    href: 'https://www.linkedin.com/in/nexory',
    icon: Linkedin,
    external: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/nexory',
    helper: 'Veja o código dos últimos projetos',
    href: 'https://github.com/nexory',
    icon: Github,
    external: true,
  },
];

const highlightItems = [
  'Arquitetura moderna com foco em performance e acessibilidade.',
  'Design responsivo alinhado a uma experiência consistente.',
  'Integrações, automações e suporte contínuo pós-lançamento.',
];

const asideNotes = [
  'Disponível para oportunidades remotas ou híbridas.',
  'Falo português nativo e inglês intermediário/avançado.',
  'Horários flexíveis, com reuniões em GMT-3.',
];

const asideStats = [
  { value: '20+', label: 'Projetos entregues' },
  { value: '5+', label: 'Anos de experiência' },
  { value: '24h', label: 'Kick-off após aprovação' },
];

const Contact = () => {
  const whatsappLink = contactChannels.find(
    (item) => item.label === 'WhatsApp',
  )?.href;

  return (
    <S.Wrapper>
      <Header />
      <S.Section>
        <S.IntroGrid>
          <S.HeroCard>
            <S.Badge>Contato direto</S.Badge>
            <S.HeroTitle>Pronto para acelerar seu projeto digital?</S.HeroTitle>
            <S.HeroDescription>
              Conte com um parceiro técnico para construir soluções web
              robustas, que alinham estratégia, design e desenvolvimento de
              ponta a ponta.
            </S.HeroDescription>
            <S.HighlightList>
              {highlightItems.map((item, index) => (
                <S.HighlightItem
                  key={item}
                  style={{ '--item-index': index } as React.CSSProperties}
                >
                  <S.HighlightDot />
                  {item}
                </S.HighlightItem>
              ))}
            </S.HighlightList>
            <S.ResponseTime>Tempo médio de resposta: 12h úteis</S.ResponseTime>
            <S.CTAGroup>
              <Button
                size="lg"
                variant="glow"
                onClick={() =>
                  whatsappLink && window.open(whatsappLink, '_blank')
                }
              >
                Conversar pelo WhatsApp
              </Button>
              <S.SecondaryLink href="mailto:contato@nexory.com.br">
                Preferir enviar briefing por e-mail?
              </S.SecondaryLink>
            </S.CTAGroup>
          </S.HeroCard>
          <S.HeroAside>
            <S.HeroAsideCard>
              <S.HeroAsideBadge>Como atuo</S.HeroAsideBadge>
              <S.HeroAsideTitle>
                Parceria estratégica do discovery ao deploy
              </S.HeroAsideTitle>
              <S.HeroAsideText>
                A Nexory combina frontend, backend e arquitetura cloud para
                entregar produtos digitais completos. Posso atuar lado a lado
                com seu time ou assumir o desenvolvimento end-to-end.
              </S.HeroAsideText>
              <S.HeroAsidePanel>
                <S.HeroAsideList>
                  {asideNotes.map((note) => (
                    <li key={note}>
                      <Check />
                      {note}
                    </li>
                  ))}
                </S.HeroAsideList>
                <S.HeroAsideNote>
                  Precisa de NDA, proposta formal ou cronograma detalhado? Envie
                  o contexto que retorno com tudo organizado.
                </S.HeroAsideNote>
              </S.HeroAsidePanel>
            </S.HeroAsideCard>
            <S.HeroAsideStats>
              {asideStats.map(({ value, label }, index) => (
                <S.HeroAsideStat
                  key={label}
                  style={
                    {
                      '--card-delay': `${0.12 * index}s`,
                    } as React.CSSProperties
                  }
                >
                  <strong>{value}</strong>
                  <span>{label}</span>
                </S.HeroAsideStat>
              ))}
            </S.HeroAsideStats>
            <S.HeroAsideLogo>
              <img
                src={logo}
                alt="Logo temporária Nexory Studio"
                draggable={false}
              />
            </S.HeroAsideLogo>
          </S.HeroAside>
        </S.IntroGrid>

        <S.ChannelsSection>
          <S.ChannelsHeader>
            <S.ChannelsTitle>
              Escolha onde prefere continuar a conversa
            </S.ChannelsTitle>
            <S.ChannelsSubtitle>
              Estou disponível para alinhamentos rápidos, apresentação de
              portfólio completo, estimativas e definição de roadmap. Só
              escolher o canal.
            </S.ChannelsSubtitle>
          </S.ChannelsHeader>

          <S.ChannelsGrid>
            {contactChannels.map(
              ({ label, value, helper, href, icon: Icon, external }, index) => (
                <S.ContactCard
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  style={
                    {
                      '--card-delay': `${0.18 * index}s`,
                    } as React.CSSProperties
                  }
                >
                  <S.ContactIcon>
                    <Icon />
                  </S.ContactIcon>
                  <S.ContactContent>
                    <S.ContactLabel>{label}</S.ContactLabel>
                    <S.ContactValue>{value}</S.ContactValue>
                    <S.ContactHelper>{helper}</S.ContactHelper>
                  </S.ContactContent>
                  <S.ContactArrow>
                    <ArrowUpRight />
                  </S.ContactArrow>
                </S.ContactCard>
              ),
            )}
          </S.ChannelsGrid>
        </S.ChannelsSection>
      </S.Section>
      <FooterGlobal />
    </S.Wrapper>
  );
};

export default Contact;
