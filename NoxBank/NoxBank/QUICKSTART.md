# 🚀 Guia Rápido - NoxBank

## Setup Inicial (Execute uma vez)

```powershell
# 1. Instalar dependências
npm install

# 2. Criar banco de dados
node ace migration:run

# 3. Popular com dados de teste
node ace db:seed
```

## Desenvolvimento

```powershell
# Iniciar servidor (http://localhost:3333)
npm run dev

# Rodar em outra porta
PORT=4000 npm run dev
```

## Comandos Úteis

### Banco de Dados

```powershell
# Recriar banco (apaga tudo e recria)
node ace migration:fresh

# Recriar + popular com dados
node ace migration:fresh --seed

# Ver status das migrations
node ace migration:status

# Criar nova migration
node ace make:migration nome_da_migration
```

### TypeScript

```powershell
# Verificar erros de tipo
npm run typecheck

# Build para produção
npm run build

# Rodar testes
npm test
```

### Limpar e Resetar

```powershell
# Limpar cache do Node
rm -r node_modules
npm install

# Limpar banco e recriar
rm tmp/db.sqlite3
node ace migration:fresh --seed
```

## Credenciais de Teste

| Usuário | Email | Senha |
|---------|-------|-------|
| Ana (Vítima) | ana@example.com | senha123 |
| Isabella (Golpista) | isabella@example.com | senha123 |
| João | joao@example.com | senha123 |

## URLs Principais

- Login: http://localhost:3333/login
- Conta: http://localhost:3333/conta (requer login)
- Extrato: http://localhost:3333/extrato (requer login)
- PIX: http://localhost:3333/pix (requer login)

## Teste Rápido do Fluxo de Golpe

1. Login com Ana: `ana@example.com` / `senha123`
2. Ir para PIX
3. Digitar CPF de Isabella: `123.456.789-00`
4. Digitar valor: `350`
5. Ver alerta de golpe aparecer 🚨
6. Testar estorno seguro no extrato

## Logs e Debug

```powershell
# Ver logs em tempo real
npm run dev

# Verificar erros de compilação
npm run typecheck

# Ver estrutura do banco
sqlite3 tmp/db.sqlite3 ".schema"

# Ver dados das tabelas
sqlite3 tmp/db.sqlite3 "SELECT * FROM users;"
sqlite3 tmp/db.sqlite3 "SELECT * FROM transactions;"
```

## Solução de Problemas

### Porta 3333 em uso
```powershell
# Encontrar processo
netstat -ano | findstr :3333

# Matar processo (substitua PID)
taskkill /PID <numero> /F

# Ou use outra porta
PORT=4000 npm run dev
```

### Erro de migração
```powershell
# Resetar completamente
rm tmp/db.sqlite3
node ace migration:fresh --seed
```

### Erro de TypeScript
```powershell
# Limpar e reinstalar
rm -r node_modules
npm install
npm run typecheck
```

## Comandos PowerShell Úteis

```powershell
# Ver arquivos do projeto
ls -R

# Buscar texto nos arquivos
Select-String -Path "**/*.ts" -Pattern "texto"

# Ver tamanho do projeto
Get-ChildItem -Recurse | Measure-Object -Property Length -Sum
```

## Estrutura de Arquivos Importantes

```
📂 app/controllers/     → Lógica de negócio
📂 app/models/          → Modelos do banco
📂 database/migrations/ → Estrutura do BD
📂 database/seeders/    → Dados de teste
📂 inertia/pages/       → Páginas React
📄 start/routes.ts      → Rotas da aplicação
📄 README.md            → Documentação completa
```

## APIs de Teste (CURL)

### Login
```powershell
curl -X POST http://localhost:3333/login `
  -H "Content-Type: application/json" `
  -d '{"email":"ana@example.com","password":"senha123"}'
```

### Validar PIX (testa detecção de golpe)
```powershell
curl -X POST http://localhost:3333/pix/validate `
  -H "Content-Type: application/json" `
  -d '{"identifier":"123.456.789-00","amount":350.00}'
```

---

💡 **Dica:** Mantenha este arquivo aberto em uma aba para referência rápida!
