# SMTP e cron de produção

- **Status:** preparado no repositório; ativação dos crons e validação Django ainda pendentes
- **Ambiente:** HomeHost Python App + SMTP operacional da Repage
- **Responsável:** Lukas Frick
- **Última validação:** SMTP real validado externamente; fluxo cPanel Cron → `cloudlinux-selector` → Python App validado com probe temporário
- **Frequência:** retry a cada 15 minutos; cleanup diariamente às 03:17

## Objetivo

Documentar o transporte SMTP de produção e a execução segura dos dois jobs
operacionais já existentes, sem ativá-los automaticamente nesta entrega.

## Pré-condições

- código versionado presente em `/home/re190924/repage_backend`;
- Python App configurada com Python 3.12;
- virtualenv existente em `/home/re190924/virtualenv/repage_backend/3.12/`;
- variáveis SMTP configuradas somente no ambiente da Python App;
- `cloudlinux-selector` disponível em `/usr/sbin/cloudlinux-selector`;
- os scripts versionados de cron presentes no app root;
- destinatários de qualquer teste Django controlado previamente autorizados.

## Acessos necessários

- cPanel Cron Jobs para criar, desabilitar ou remover as tarefas;
- Setup Python App para revisar variáveis sem copiar seus valores para o Git;
- Django Admin para inspecionar `EmailDelivery` após validação autorizada.

Não registrar senha SMTP, token, connection string ou valores completos das
variáveis de ambiente.

## SMTP

O transporte de produção usa o backend SMTP nativo do Django:

- servidor: `mail.repage.com.br`;
- porta: `465`;
- SSL implícito: `EMAIL_USE_SSL=True`;
- TLS explícito: `EMAIL_USE_TLS=False`;
- remetente operacional: `notificacoes@repage.com.br`;
- destinatário interno: `contato@repage.com.br`;
- timeout finito;
- autenticação obrigatória.

TLS e SSL não podem estar ativos simultaneamente. A senha permanece somente
no ambiente da Python App.

## Cron versionado

O wrapper `scripts/run_production_cron.sh` aceita somente duas tarefas
allowlisted. Ele chama o `cloudlinux-selector` com um script Python versionado,
captura a resposta em diretório temporário restrito, usa o parser versionado
para validar o `returncode` interno e remove os temporários mesmo diante de
falha. Nenhum stdout/stderr bruto do selector é impresso.

Os comandos finais a configurar no cPanel depois de o código estar realmente
presente na produção são:

```cron
*/15 * * * * /bin/bash /home/re190924/repage_backend/scripts/run_production_cron.sh process_email_retries
17 3 * * * /bin/bash /home/re190924/repage_backend/scripts/run_production_cron.sh cleanup_idempotency
```

Os horários usam a hora local observada no servidor, `America/Sao_Paulo`,
UTC-03:00. Não configurar essas linhas antes da implantação versionada nem
criar um cron paralelo com lógica diferente.

## Procedimento

1. Após a implantação aprovada, confirmar que os três scripts de cron e o
   parser estão no app root.
2. No cPanel Cron Jobs, criar as duas tarefas exatamente como acima.
3. Executar cada tarefa manualmente pela interface ou aguardar sua janela.
4. Confirmar uma linha sanitizada de sucesso no resultado do cron.
5. Conferir o efeito operacional no Django Admin e nos logs, sem copiar dados
   de leads para evidências.

Para uma validação manual controlada, executar os mesmos comandos, um por vez:

```bash
/bin/bash /home/re190924/repage_backend/scripts/run_production_cron.sh process_email_retries
/bin/bash /home/re190924/repage_backend/scripts/run_production_cron.sh cleanup_idempotency
```

Sucesso significa exit code `0` e mensagem curta de sucesso. Falha significa
exit code diferente de zero; investigar o log sanitizado e o estado do Admin,
sem exibir o payload do selector.

## Validação futura do SMTP pelo Django

Essa validação ainda não deve ser executada nesta fase. Quando o código estiver
implantado, usar somente endereços autorizados e controlados para confirmar:

- autenticação SSL na porta 465;
- notificação interna para `contato@repage.com.br`;
- confirmação para um endereço de teste autorizado;
- `Reply-To` na notificação interna;
- persistência do `Lead` antes do envio;
- estados `EmailDelivery` e retry após falha controlada;
- inspeção pelo Django Admin;
- ausência de PII e credenciais nos logs.

Não usar dados reais de terceiros nem criar um job permanente de teste de
e-mail.

## Falhas conhecidas

- O cron real ainda não está ativado por esta entrega.
- O shell SSH comum não possui o ambiente da Python App; não chamar
  `manage.py` diretamente por SSH.
- Um erro do comando Django deve aparecer como falha do `cloudlinux-selector`
  ou do `returncode` interno, sem depender apenas do exit code externo.
- Falha SMTP não remove o Lead; a entrega permanece registrada para retry ou
  ação administrativa.
- A validação Django end-to-end e o recebimento real após implantação ainda
  estão pendentes.

## Recuperação

Em caso de falha repetida, desabilitar temporariamente a tarefa afetada no
cPanel, preservar somente horário, tarefa e mensagem sanitizada, e investigar
`EmailDelivery`, `stderr.log` e os health checks. Corrigir a causa antes de
reativar.

Não apagar manualmente deliveries nem executar migrations reversas como parte
da recuperação. Para remover uma tarefa, desabilite-a primeiro e depois remova
a linha do cPanel após confirmar que não há execução em andamento.

## Evidências

Já comprovado:

- conexão SMTP real por `smtplib`, com SSL na porta 465;
- remetente e destinatário operacionais;
- certificado TLS válido;
- cron temporário cPanel → `cloudlinux-selector` → Python App;
- timezone do servidor em UTC-03:00.

Ainda pendente:

- ativação dos dois crons finais após implantação;
- envio controlado pelo Django;
- confirmação de retry e inspeção pós-envio em produção.

## Segurança e privacidade

Não registrar senha, token, private key, connection string, valores de
Environment Variables, corpo de e-mail, formulário, nome, e-mail, telefone,
mensagem de Lead ou stdout/stderr bruto do selector. Não versionar arquivos de
probe, logs ou resultados reais.

## Referências

- [`production-deploy.md`](production-deploy.md)
- [`production-observability.md`](production-observability.md)
- [`../../backend/scripts/run_production_cron.sh`](../../backend/scripts/run_production_cron.sh)
