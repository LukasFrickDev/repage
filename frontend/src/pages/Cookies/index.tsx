import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { useConsent } from '../../features/consent/useConsent';
import * as S from '../StructuralPage/styles';

const cookiePolicyVersion = '2026-08-20-v1';
const cookiePolicyDate = '20 de agosto de 2026';

export function CookiesPage() {
  const { openPreferences } = useConsent();
  useRouteMetadata(routeMetadata.cookies);

  return (
    <S.Page aria-labelledby="cookies-title">
      <S.Container>
        <S.DocumentHeader>
          <S.Eyebrow>Cookies</S.Eyebrow>
          <S.Title id="cookies-title" data-route-heading tabIndex={-1}>Política de Cookies</S.Title>
          <S.Description>
            Esta Política explica como cookies e tecnologias semelhantes são usados para funcionamento e, quando autorizado, medição do site.
          </S.Description>
          <S.DocumentMeta>Data da versão: {cookiePolicyDate}<br />Versão: {cookiePolicyVersion}</S.DocumentMeta>
        </S.DocumentHeader>

        <S.DocumentBody>
          <S.DocumentSection aria-labelledby="cookies-categories">
            <S.SectionTitle id="cookies-categories">Categorias utilizadas</S.SectionTitle>
            <S.Paragraph>
              A central de preferências organiza as tecnologias do site em necessários, analíticos e publicitários. Necessários permanecem ativos; Analíticos e Publicitários começam desligados e dependem de uma escolha opcional.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="cookies-necessary">
            <S.SectionTitle id="cookies-necessary">Necessários</S.SectionTitle>
            <S.Paragraph>
              Tecnologias necessárias apoiam segurança, navegação e preferências essenciais. Elas não dependem de consentimento opcional e incluem a persistência local da escolha de consentimento.
            </S.Paragraph>
            <S.Paragraph>
              A aplicação usa a chave conceitual <code>repage:consent:v1</code> no <code>localStorage</code>. Esse registro contém a versão do contrato, as categorias escolhidas e a data/hora da atualização. Não armazena nome, e-mail, telefone, Lead ID ou conteúdo do formulário.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="cookies-analytics">
            <S.SectionTitle id="cookies-analytics">Analíticos</S.SectionTitle>
            <S.Paragraph>
              Analíticos ficam desligados por padrão. O Google Analytics 4 só é carregado depois que <code>analytics=true</code> é autorizado. Se não houver Measurement ID configurado, essa funcionalidade permanece desligada.
            </S.Paragraph>
            <S.Paragraph>
              A finalidade é medir o uso do site e interações de forma agregada para compreender seu desempenho. Quando carregado, o GA4 pode usar cookies first-party como <code>_ga</code>, usado para distinguir usuários, e <code>_ga_&lt;container-id&gt;</code>, usado para manter estado da sessão. A validade padrão do Google pode chegar a dois anos, mas a duração varia conforme a configuração e os limites do navegador.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="cookies-advertising">
            <S.SectionTitle id="cookies-advertising">Publicitários</S.SectionTitle>
            <S.Paragraph>
              Publicitários começa desligado. Autorizar <code>advertising=true</code> sozinho não carrega a tag Google: ela só pode existir depois de consentimento para Analíticos.
            </S.Paragraph>
            <S.Paragraph>
              Quando o GA4 estiver ativo, essa preferência controla os sinais de Consent Mode relacionados a <code>ad_storage</code>, <code>ad_user_data</code> e <code>ad_personalization</code>. Com Publicitários recusado, esses sinais permanecem <code>denied</code>; com Publicitários autorizado, podem ser <code>granted</code>.
            </S.Paragraph>
            <S.Paragraph>
              Essa preparação permite mensuração de conversões por uma integração entre GA4 e Google Ads quando ela estiver configurada. Isso não significa que exista campanha publicitária ativa. Não há tag Google Ads dedicada nesta arquitetura, remarketing, Enhanced Conversions ou Meta Pixel nesta entrega.
            </S.Paragraph>
          </S.DocumentSection>

          <S.DocumentSection aria-labelledby="cookies-preferences">
            <S.SectionTitle id="cookies-preferences">Revisar preferências</S.SectionTitle>
            <S.Paragraph>
              Você pode revisar sua escolha sem limpar manualmente cookies ou o armazenamento local do navegador.
            </S.Paragraph>
            <S.Actions>
              <S.ActionButton type="button" onClick={openPreferences}>Revisar preferências</S.ActionButton>
            </S.Actions>
          </S.DocumentSection>

          <S.Actions>
            <S.ActionLink to="/" data-primary="true">Voltar para a página inicial</S.ActionLink>
            <S.ActionLink to="/privacidade">Ver Política de Privacidade</S.ActionLink>
          </S.Actions>
        </S.DocumentBody>
      </S.Container>
    </S.Page>
  );
}
