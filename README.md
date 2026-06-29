## Próximos passos — integração multi-tenant, worker e billing

Adicionei suporte inicial row-based multi-tenant no schema Prisma e ajustei o seed para criar um tenant (com slug `comerci-ai`) e associar o admin e leads a esse tenant.

O fluxo implementado (inicial)
- Prisma schema com model Tenant, e as tabelas User e Lead associadas por `tenantId`.
- `prisma/seed.ts` cria o tenant e popula um usuário admin e 3 leads (tenantId setado).
- Endpoints de leads (`/api/leads` e `/api/leads/[id]`) agora exigem o header `x-tenant-id` com o ID numérico do tenant. Isso é o enforcement row-based inicial.
- Worker simples usando BullMQ (`src/worker/worker.ts`) lê jobs da fila `emails` e envia usando SendGrid.
- Endpoint `/api/queue/email` para enfileirar envios de e-mail.
- Endpoints iniciais de Stripe (`/api/billing/checkout` e `/api/billing/webhook`) placeholders para criar checkout e receber webhooks.

Variáveis de ambiente (obrigatórias para rodar features integradas)
- DATABASE_URL (ex.: file:./dev.db)
- JWT_SECRET
- REDIS_URL (ex.: redis://127.0.0.1:6379)
- SENDGRID_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Como rodar localmente (resumido)
1) Instalar dependências
   npm install

2) Copiar .env.example para .env e ajustar (adicionar REDIS_URL, SENDGRID_API_KEY, STRIPE keys)

3) Gerar Prisma Client e migrar
   npx prisma generate
   npx prisma migrate dev --name tenant

4) Rodar seed
   npm run seed

5) Rodar worker (em outro terminal)
   npx ts-node src/worker/worker.ts

6) Rodar app
   npm run dev

Como testar tenant enforcement
- Utilize o tenant criado pelo seed. Para descobrir o ID, pode abrir um REPL do Prisma ou incluir um endpoint temporário. Por simplicidade: após rodar seed, abra `npx prisma studio` e verifique a tabela Tenant — copie o id.
- Então faça requisições HTTP para /api/leads com header `x-tenant-id: <id>`.

O que eu recomendo seguir agora
1) Configurar Redis (p.ex. via Docker: `docker run -p 6379:6379 redis`) para testar o worker
2) Criar conta SendGrid e Stripe e adicionar chaves nos secrets
3) Adicionar extra middleware para extrair tenant do JWT (se preferir não enviar header)
4) Automatizar criação de tenant ao pagar via Stripe no webhook

Quer que eu:
A) Abra PR com essas mudanças na branch crm-scaffold (atual branch) — eu já estou trabalhando nela.
B) Adicione endpoint para listar tenants (privado) para facilitar testes e devolver ID.
C) Implementar extra middleware que le o tenant do token JWT e remova a necessidade do header.

Responda com as letras das opções que quer que eu faça em seguida (ex.: "A B").
