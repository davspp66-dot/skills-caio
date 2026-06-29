## Próximos passos — integração multi-tenant, worker e billing

Adicionei suporte inicial row-based multi-tenant no schema Prisma e ajustei o seed para criar um tenant (com slug `comerci-ai`) e associar o admin e leads a esse tenant.

Novas funcionalidades aplicadas nesta iteração:
- Middleware helper `src/lib/tenant.ts` que extrai o tenant id do header `x-tenant-id` ou do token JWT (Authorization: Bearer <token>) — preferível para integrações com auth.
- Endpoints de leads atualizados para usar `getTenantIdFromReq` (não é mais necessário enviar manualmente o header se usar um token válido).
- Endpoint `GET /api/tenants` criado para listar tenants (requer token Bearer de um usuário `admin`).

Como testar localmente
1) Siga os passos já descritos antes para migrar/seed
2) Obtenha o token do admin (ainda não tem endpoint de login que retorna token? Use /api/auth/login with seeded admin email and password)
3) Teste listar tenants:
   curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/tenants

Notas de segurança
- Tokens devem ser gerados com JWT_SECRET forte e nunca com o valor padrão em produção.
- Em produção, armazene chaves (SENDGRID, STRIPE, REDIS) nos Secrets do GitHub ou no provider.

