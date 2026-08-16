import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import * as S from '../StructuralPage/styles';

const documentDate = '16 de agosto de 2026';

export function PrivacyPage() {
  useRouteMetadata(routeMetadata.privacy);

  return (
    <S.Page aria-labelledby="privacy-title">
      <S.Container>
        <S.DocumentHeader>
          <S.Eyebrow>Privacidade</S.Eyebrow>
          <S.Title id="privacy-title" data-route-heading tabIndex={-1}>Política de Privacidade</S.Title>
          <S.Description>
            Este é um rascunho técnico de pré-lançamento, escrito para explicar de forma direta como a Repage trata dados relacionados ao site e aos contatos recebidos.
          </S.Description>
        </S.DocumentHeader>

        <S.DocumentBody>
          <S.DocumentSection aria-labelledby="privacy-introduction">
            <S.SectionTitle id="privacy-introduction">Sobre esta política</S.SectionTitle>
            <S.Paragraph>
              Esta Política descreve como a Repage trata dados pessoais fornecidos pelo visitante ao usar o site ou enviar uma solicitação de orçamento. A Repage é uma marca conduzida por Lukas Frick.
            </S.Paragraph>
            <S.Paragraph>
              Assuntos relacionados a privacidade podem ser encaminhados para <a href="mailto:contato@repage.com.br">contato@repage.com.br</a>. Este texto é informativo e ainda não representa aconselhamento jurídico ou revisão jurídica definitiva.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-provided-data">
            <S.SectionTitle id="privacy-provided-data">Dados fornecidos pelo visitante</S.SectionTitle>
            <S.Paragraph>Quando você preenche o formulário de orçamento, a aplicação pode receber:</S.Paragraph>
            <S.List>
              <li>nome;</li>
              <li>e-mail;</li>
              <li>WhatsApp;</li>
              <li>tipo de projeto;</li>
              <li>marca, negócio ou projeto, quando informado;</li>
              <li>mensagem, quando informada;</li>
              <li>ciência da Política de Privacidade;</li>
              <li>versão da Política registrada no envio.</li>
            </S.List>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-technical-data">
            <S.SectionTitle id="privacy-technical-data">Dados técnicos e segurança</S.SectionTitle>
            <S.Paragraph>
              O site e o backend podem processar temporariamente dados técnicos necessários ao funcionamento, à segurança, à prevenção de abuso, à limitação de frequência e ao controle de repetição de solicitações. Isso pode incluir endereço IP usado temporariamente para proteção.
            </S.Paragraph>
            <S.Paragraph>
              O endereço IP não é afirmado aqui como campo persistido no registro do Lead. Os mecanismos específicos de proteção não são detalhados além do necessário para não enfraquecer a segurança do formulário.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-purposes">
            <S.SectionTitle id="privacy-purposes">Finalidades</S.SectionTitle>
            <S.List>
              <li>receber e analisar a solicitação enviada;</li>
              <li>responder e entrar em contato sobre a própria solicitação;</li>
              <li>conduzir tratativas relacionadas ao projeto solicitado;</li>
              <li>confirmar o recebimento da solicitação;</li>
              <li>proteger o formulário contra abuso ou repetição;</li>
              <li>manter a segurança e a operação do site;</li>
              <li>medir a utilização do site somente quando houver consentimento analítico.</li>
            </S.List>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-communication">
            <S.SectionTitle id="privacy-communication">Comunicação</S.SectionTitle>
            <S.Paragraph>
              Os dados fornecidos podem ser usados para responder à solicitação e conduzir a conversa relacionada ao projeto. Isso não constitui autorização genérica para newsletter ou marketing automático por e-mail.
            </S.Paragraph>
            <S.Paragraph>
              A ciência desta Política no formulário é separada do consentimento opcional para Analytics e cookies.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-analytics">
            <S.SectionTitle id="privacy-analytics">Analytics</S.SectionTitle>
            <S.Paragraph>
              O Google Analytics 4 é uma tecnologia não essencial. Ele começa desligado e só é carregado pela aplicação depois que o visitante autoriza a categoria Analíticos. Antes disso, o script não é solicitado.
            </S.Paragraph>
            <S.Paragraph>
              Os eventos definidos pela Repage não incluem conteúdo do formulário, nome, e-mail, WhatsApp, Lead ID ou request ID. Ainda assim, o Google Analytics pode processar dados técnicos próprios de seu funcionamento; esta política não promete anonimato absoluto.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-sharing">
            <S.SectionTitle id="privacy-sharing">Compartilhamento e prestadores</S.SectionTitle>
            <S.Paragraph>
              Quando necessário ao funcionamento, os dados podem ser tratados por categorias de prestadores técnicos, como infraestrutura e hospedagem, serviços de e-mail e fornecedores necessários à operação. O Google Analytics é incluído somente após consentimento analítico.
            </S.Paragraph>
            <S.Paragraph>
              A Repage não descreve neste rascunho fornecedores específicos que ainda não estejam definidos como parte operacional relevante e não vende dados pessoais.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-retention">
            <S.SectionTitle id="privacy-retention">Retenção</S.SectionTitle>
            <S.Paragraph>
              Os dados de solicitação são mantidos pelo período necessário para analisar o contato, conduzir tratativas relacionadas, atender finalidades operacionais e cumprir obrigações aplicáveis. Quando deixarem de ser necessários, devem ser eliminados ou tratados conforme hipóteses de conservação aplicáveis.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-rights">
            <S.SectionTitle id="privacy-rights">Direitos e preferências</S.SectionTitle>
            <S.Paragraph>
              Conforme aplicável, o titular pode solicitar informações relacionadas ao tratamento, acesso, correção e eliminação, além de exercer outros direitos previstos na legislação aplicável. Solicitações podem ser encaminhadas para <a href="mailto:contato@repage.com.br">contato@repage.com.br</a>.
            </S.Paragraph>
            <S.Paragraph>
              As preferências opcionais de cookies e Analytics podem ser revistas a qualquer momento pela central de preferências disponível no rodapé.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="privacy-updates">
            <S.SectionTitle id="privacy-updates">Atualizações</S.SectionTitle>
            <S.Paragraph>
              Esta Política de Privacidade pode ser atualizada para refletir mudanças no funcionamento do site, nos serviços utilizados ou nas práticas de tratamento de dados. Quando houver alterações relevantes, a versão e a data desta página serão atualizadas.
            </S.Paragraph>
            <S.DocumentMeta>Versão: pré-lançamento v1<br />Última atualização: {documentDate}</S.DocumentMeta>
          </S.DocumentSection>

          <S.Actions>
            <S.ActionLink to="/" data-primary="true">Voltar para a página inicial</S.ActionLink>
            <S.ActionLink to="/cookies">Ver Política de Cookies</S.ActionLink>
          </S.Actions>
        </S.DocumentBody>
      </S.Container>
    </S.Page>
  );
}
