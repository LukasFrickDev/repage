import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors, breakpoints } from '../styles/globalStyles';

interface LangData {
  [lang: string]: number;
}

interface GithubRepo {
  fork: boolean;
  languages_url: string;
}

const REPOS_PER_PAGE = 100;
const MAX_PAGES = 10; // segurança

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#FDE68A',
  CSS: '#1572B6',
  HTML: '#E34F26',
  Shell: '#89e051',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Java: '#b07219',
  C: '#555555',
  CSharp: '#178600',
  Go: '#00ADD8',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Dart: '#00B4AB',
  Makefile: '#427819',
  // ...adicione mais se quiser
};

const ChartWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const ChartTitle = styled.h3`
  color: ${colors.highlightStrong};
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.18rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.01em;
  text-align: left;
  text-shadow: 0 2px 12px ${colors.neonBlue}22;
`;

const BarTrack = styled.div`
  position: relative;
  height: 1.05rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #1b1b21 0%, #111116 60%, #0c0c10 100%);
  border: 1px solid ${colors.gridLine};
  box-shadow: inset 0 0 6px ${colors.gridLine}44;
  overflow: hidden;
`;

interface BarFillProps {
  percent: number;
  color: string;
}
const BarFill = styled.div<BarFillProps>`
  position: relative;
  height: 100%;
  width: ${({ percent }) => percent}%;
  max-width: 100%;
  min-width: ${({ percent }) => (percent > 0 ? '0.35rem' : '0')};
  border-radius: inherit;
  background: ${({ color }) =>
    `linear-gradient(90deg, transparent 0%, ${color} 100%)`};
  box-shadow:
    0 10px 28px -18px #e5e7ebaa,
    inset 0 0 10px #ffffff1f;
  transition: width 0.7s cubic-bezier(0.4, 1.4, 0.6, 1);
  transform-origin: left;
`;

const BarLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.13rem;
  color: ${colors.white};
  font-size: 1.01rem;
  font-family: 'Fira Code', monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 8px ${colors.neonBlue}22;
  padding: 0 0.2rem;
`;

const LabelName = styled.span`
  color: ${colors.white};
  text-shadow: none;
`;

const LabelPercent = styled.span`
  color: ${colors.textSecondary};
  font-size: 0.92rem;
  padding-left: 0.4rem;
`;

const LanguageLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
`;

const LanguageDot = styled.span<{ color: string }>`
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 0.2rem;
  background: ${({ color }) => color};
  box-shadow: 0 0 12px ${({ color }) => `${color}55`};
`;

const LangGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem 1.2rem;
  margin-top: 0.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const GithubLangChart = ({
  username = 'LukasFrickDev',
}: {
  username?: string;
}) => {
  const [langs, setLangs] = useState<LangData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLangs() {
      setLoading(true);
      setError(null);

      const cacheKey = `github-langs-direct-${username}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { timestamp: number; langs: LangData };
          const oneHour = 60 * 60 * 1000;
          if (Date.now() - parsed.timestamp < oneHour) {
            setLangs(parsed.langs);
            setLoading(false);
            return;
          }
        } catch {
          sessionStorage.removeItem(cacheKey);
        }
      }

      const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
      const headers: HeadersInit = {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const repos: GithubRepo[] = [];
        for (let page = 1; page <= MAX_PAGES; page += 1) {
          const res = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=${REPOS_PER_PAGE}&page=${page}`,
            { headers },
          );
          if (!res.ok) {
            if (res.status === 403) {
              setError('Limite de requisições do GitHub atingido. Adicione VITE_GITHUB_TOKEN.');
            } else {
              setError('Falha ao carregar repositórios do GitHub.');
            }
            setLoading(false);
            return;
          }
          const data = (await res.json()) as GithubRepo[];
            repos.push(...data);
          if (data.length < REPOS_PER_PAGE) break;
        }

        const totals: LangData = {};
        for (const repo of repos) {
          if (repo.fork) continue;
          try {
            const lr = await fetch(repo.languages_url, { headers });
            if (!lr.ok) continue;
            const langJson = await lr.json();
            for (const [l, bytes] of Object.entries(langJson)) {
              totals[l] = (totals[l] || 0) + (bytes as number);
            }
          } catch {
            // ignora erros individuais
          }
        }
        setLangs(totals);
        sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), langs: totals }));
      } catch {
        setError('Erro inesperado ao buscar linguagens.');


      } finally {
        setLoading(false);
      }
    }
    fetchLangs();
  }, [username]);

  // Ordena por uso
  const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 6);
  const topTotal = top.reduce((acc, [, v]) => acc + v, 0);
  const processedLangs = top.map(([lang, value], idx) => {
    const rawPercent = topTotal ? (value / topTotal) * 100 : 0;
    const percent = Math.round(rawPercent * 100) / 100; // 2 casas
    const color = LANG_COLORS[lang] || colors.highlight;
    return { lang, percent, color, idx };
  });

  return (
    <ChartWrapper>
      <ChartTitle>Linguagens mais utilizadas</ChartTitle>
      {loading && (
        <div
          style={{
            color: colors.textSecondary,
            fontFamily: 'Fira Code, monospace',
            fontSize: '1rem',
            padding: '0.7rem 0',
          }}
        >
          Carregando...
        </div>
      )}
      {!loading && error && (
        <div
          style={{
            color: '#fb7185',
            fontFamily: 'Fira Code, monospace',
            fontSize: '1rem',
            padding: '0.7rem 0',
          }}
        >
          {error}
        </div>
      )}
      {!loading && !error && processedLangs.length === 0 && (
        <div
          style={{
            color: colors.textSecondary,
            fontFamily: 'Fira Code, monospace',
            fontSize: '1rem',
            padding: '0.7rem 0',
          }}
        >
          Nenhum dado encontrado.
        </div>
      )}
      {!loading && !error && processedLangs.length > 0 && (
        <>
          {/* Barra de stacks igual github-readme-stats */}
          <div
            style={{
              width: '100%',
              height: '0.7rem',
              borderRadius: '0.7rem',
              display: 'flex',
              overflow: 'hidden',
              marginBottom: '1.2rem',
              background: '#18181b',
              border: `1px solid ${colors.gridLine}`,
              boxShadow: `0 2px 12px 0 ${colors.neonBlue}11`,
            }}
          >
            {processedLangs.map(({ lang, percent, color }, idx) => (
              <div
                key={lang}
                style={{
                  width: `${percent}%`,
                  background: `linear-gradient(90deg, ${color} 60%, #18181b 100%)`,
                  height: '100%',
                  borderTopLeftRadius: idx === 0 ? '0.7rem' : 0,
                  borderBottomLeftRadius: idx === 0 ? '0.7rem' : 0,
                  borderTopRightRadius:
                    idx === processedLangs.length - 1 ? '0.7rem' : 0,
                  borderBottomRightRadius:
                    idx === processedLangs.length - 1 ? '0.7rem' : 0,
                  transition: 'width 0.7s cubic-bezier(0.4, 1.4, 0.6, 1)',
                }}
                title={`${lang} ${percent.toFixed(1)}%`}
              />
            ))}
          </div>
          <LangGrid>
            {processedLangs.map(({ lang, percent, color, idx }) => (
              <div
                key={lang}
                style={{
                  animation: 'fadeInUp 0.7s cubic-bezier(.4,1.4,.6,1)',
                  animationDelay: `${0.08 * idx + 0.1}s`,
                  animationFillMode: 'backwards',
                }}
              >
                <BarLabel>
                  <LanguageLabel>
                    <LanguageDot color={color} />
                    <LabelName>{lang}</LabelName>
                  </LanguageLabel>
                  <LabelPercent>{percent.toFixed(2)}%</LabelPercent>
                </BarLabel>
                <BarTrack>
                  <BarFill percent={percent} color={color} />
                </BarTrack>
              </div>
            ))}
          </LangGrid>
        </>
      )}
    </ChartWrapper>
  );
};
export default GithubLangChart;
