import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ServiceCard } from '../../components/ServicesCards';
import { Button } from '../../components/Button';
import services from '../../mock/services';
import * as S from './styles';
import * as SC from '../../components/ServicesCards/styles';
import { useAlignTitlesByRow } from '../../components/ServicesCards/useAlignTitlesByRow';

const Services = () => {
  useAlignTitlesByRow(
    '.service-card',
    '.service-card-title',
    '.service-card-description',
  );
  return (
    <>
      <Header />
      <SC.SectionMotion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <S.TitleBox>
          <S.Title>Nossos Serviços</S.Title>
          <S.Subtitle>
            Soluções abrangentes para dar vida à sua visão digital
          </S.Subtitle>
        </S.TitleBox>
        <S.Grid>
          {services.map((service, index) => (
            <SC.CardMotion
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
              />
            </SC.CardMotion>
          ))}
        </S.Grid>
      </SC.SectionMotion>
      <SC.SectionMotion
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <S.TitleBox style={{ marginBottom: '2.5rem' }}>
          <S.Title>Diferenciais Profissionais</S.Title>
          <S.Subtitle>
            Qualidade de ponta a ponta para garantir entrega sólida e duradoura
          </S.Subtitle>
        </S.TitleBox>
        <S.Grid
          $variant="diferencial"
          style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
        >
          <S.DifferentialsBox>
            <S.DifferentialsList>
              {[
                'Desenvolvimento completo (frontend + backend)',
                'Projetos responsivos e otimizados',
                'Código limpo e escalável',
                'Autonomia para o cliente (painéis e CMS)',
                'Suporte e manutenção pós-entrega',
                'Experiência prática com projetos reais',
              ].map((item, i) => (
                <S.DifferentialItem key={i}>
                  <S.DifferentialDot />
                  {item}
                </S.DifferentialItem>
              ))}
            </S.DifferentialsList>
          </S.DifferentialsBox>
          <S.CTABox>
            <S.CTATitle>Pronto para transformar seu projeto?</S.CTATitle>
            <S.CTADesc>
              Vamos criar algo impactante e escalável. Envie sua ideia e eu
              retorno com um plano claro para evoluirmos.
            </S.CTADesc>
            <Button
              variant="glow"
              onClick={() => (window.location.href = '/contact')}
            >
              Fale Comigo
            </Button>
          </S.CTABox>
        </S.Grid>
      </SC.SectionMotion>
      <Footer />
    </>
  );
};

export default Services;
