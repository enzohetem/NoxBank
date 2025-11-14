# 🏦 NoxBank - Sistema Bancário com Detecção de Golpes PIX

Sistema bancário acadêmico desenvolvido com AdonisJS e React (Inertia.js) para demonstrar e prevenir golpes de PIX, especificamente o golpe de "devolução acidental".

## 🎯 Problema Resolvido

**Golpe do PIX Acidental:**
1. Golpista envia PIX "por engano" para a vítima
2. Golpista pede para vítima devolver via PIX normal
3. Vítima devolve o dinheiro
4. Golpista solicita estorno no banco original
5. **Resultado:** Golpista fica com o dinheiro duas vezes

**Nossa Solução:**
- Sistema detecta quando usuário está enviando PIX para alguém que enviou valor recentemente
- Alerta aparece mostrando risco de golpe
- Oferece opção de **ESTORNO SEGURO** ao invés de PIX manual
- Estorno seguro previne dupla devolução (valida se já foi estornado)

## 🚀 Tecnologias

- **Backend:** AdonisJS 6 + TypeScript
- **Frontend:** React 19 + Inertia.js + Tailwind CSS
- **Banco de Dados:** SQLite (desenvolvimento)
- **ORM:** Lucid ORM

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn

## ⚙️ Instalação

```powershell
# Clone o repositório
cd "c:\Users\enzoh\Downloads\interface projeto\NoxBank"

# Instale as dependências
npm install

# Configure o banco de dados (SQLite)
node ace migration:run

# Popule com dados de teste
node ace db:seed
```

## 👥 Usuários de Teste

Após rodar o seeder, você terá os seguintes usuários:

| Nome | Email | Senha | Saldo | Papel |
|------|-------|-------|-------|-------|
| Ana da Silva | ana@example.com | senha123 | R$ 500,00 | Vítima (cenário teste) |
| Isabella Almeida Soares | isabella@example.com | senha123 | R$ 5.000,00 | Golpista (cenário teste) |
| João Pedro Santos | joao@example.com | senha123 | R$ 2.000,00 | Usuário extra |

## 🎮 Como Testar o Sistema

### 1. Inicie o servidor de desenvolvimento

```powershell
npm run dev
```

Acesse: http://localhost:3333

### 2. Teste o Fluxo de Golpe (Cenário Completo)

#### **Passo 1: Login como Ana (Vítima)**
1. Acesse `/login`
2. Use: `ana@example.com` / `senha123`
3. Você verá o saldo de R$ 500,00

#### **Passo 2: Verifique o Extrato**
1. Clique em "Extrato"
2. Você verá que Isabella enviou R$ 350,00 recentemente

#### **Passo 3: Tente Devolver o Dinheiro (Via PIX)**
1. Volte para "Conta"
2. Clique em "PIX"
3. Digite o CPF de Isabella: `123.456.789-00`
4. Digite o valor: `350.00`
5. **ALERTA APARECE!** 🚨
   - Sistema detecta que Isabella enviou esse mesmo valor recentemente
   - Mostra mensagem de aviso sobre possível golpe
   - Sugere usar ESTORNO ao invés de PIX manual

#### **Passo 4: Use o Estorno Seguro (Correto)**
1. Ao invés de confirmar o PIX, clique em "Cancelar envio"
2. Volte ao "Extrato"
3. Clique na transação de Isabella (R$ 350,00)
4. Clique em "Estorno"
5. Confirme o estorno
6. ✅ **Dinheiro devolvido com segurança!**
   - Sistema registra como REFUND
   - Previne duplo estorno
   - Marca transação original como "refunded"

## 🔒 Funcionalidades de Segurança

### 1. Detecção de Golpe
- Verifica transações dos últimos 7 dias
- Compara valor e remetente
- Alerta automático se detectar padrão suspeito

### 2. Estorno Seguro
- Apenas quem recebeu pode estornar
- Verifica se já foi estornado antes
- Usa transação de banco de dados (rollback em erro)
- Atualiza saldo atomicamente

### 3. Validações PIX
- Não permite PIX para si mesmo
- Verifica saldo suficiente
- Valida destinatário existe
- Confirma em duas etapas

## 📁 Estrutura do Projeto

```
NoxBank/
├── app/
│   ├── controllers/
│   │   ├── auth_controller.ts       # Login/Logout
│   │   ├── pix_controller.ts        # PIX e Estorno
│   │   └── transaction_controller.ts # Extrato
│   └── models/
│       ├── user.ts                   # Usuário
│       └── transaction.ts            # Transação
├── database/
│   ├── migrations/                   # Estrutura do BD
│   └── seeders/
│       └── user_seeder.ts            # Dados de teste
├── inertia/
│   └── pages/
│       ├── auth/
│       │   └── login.tsx             # Tela de login
│       ├── conta.tsx                 # Tela principal
│       ├── extrato.tsx               # Extrato
│       ├── pix.tsx                   # Iniciar PIX
│       ├── pixatencao.tsx            # Alerta de golpe
│       ├── informacaopix.tsx         # Detalhes transação
│       ├── reembolso1.tsx            # Confirmar estorno
│       └── reembolso2.tsx            # Estorno concluído
└── start/
    └── routes.ts                     # Rotas da aplicação
```

## 🛣️ Rotas Principais

### Autenticação
- `GET /login` - Tela de login
- `POST /login` - Processar login
- `POST /logout` - Sair

### Conta e Saldo
- `GET /conta` - Tela principal com saldo

### PIX
- `GET /pix` - Iniciar PIX
- `POST /pix/validate` - Validar destinatário e detectar golpe
- `POST /pix` - Confirmar transferência
- `POST /pix/refund` - Estorno seguro

### Transações
- `GET /extrato` - Ver histórico
- `GET /informacaopix/:id` - Detalhes de transação

## 🧪 Testando a API Diretamente

```powershell
# Login
curl -X POST http://localhost:3333/login `
  -H "Content-Type: application/json" `
  -d '{"email":"ana@example.com","password":"senha123"}'

# Validar PIX (detecta golpe)
curl -X POST http://localhost:3333/pix/validate `
  -H "Content-Type: application/json" `
  -d '{"identifier":"123.456.789-00","amount":350.00}'

# Fazer PIX
curl -X POST http://localhost:3333/pix `
  -H "Content-Type: application/json" `
  -d '{"receiverId":1,"amount":350.00}'

# Estorno
curl -X POST http://localhost:3333/pix/refund `
  -H "Content-Type: application/json" `
  -d '{"transactionId":1}'
```

## 📊 Fluxo de Dados

```
┌─────────────┐
│   Usuário   │
│  (Ana)      │
└──────┬──────┘
       │ 1. Login
       ▼
┌─────────────────┐
│ AuthController  │
│ Valida credenc. │
└──────┬──────────┘
       │ 2. Redireciona
       ▼
┌────────────────┐
│  Página Conta  │
│ (Saldo R$500)  │
└──────┬─────────┘
       │ 3. Clica "PIX"
       ▼
┌────────────────┐
│  Página PIX    │
│ Digite CPF...  │
└──────┬─────────┘
       │ 4. Valida
       ▼
┌──────────────────────┐
│  PixController       │
│  .validate()         │
│  ↓                   │
│  Busca transação     │
│  recente de Isabella │
│  ↓                   │
│  DETECTA RISCO! 🚨   │
└──────┬───────────────┘
       │ 5. Retorna alerta
       ▼
┌────────────────────┐
│ Página PIX Atenção │
│ ⚠️ GOLPE DETECTADO │
│ [Cancelar] [Conf.] │
└──────┬─────────────┘
       │ 6. Cancela
       ▼
┌───────────────────┐
│  Página Extrato   │
│  Clica transação  │
└──────┬────────────┘
       │ 7. Estorno
       ▼
┌──────────────────┐
│ PixController    │
│ .refund()        │
│ ↓                │
│ Valida permissão │
│ Verifica duplic. │
│ Processa estorno │
│ ✅ Sucesso!      │
└──────────────────┘
```

## 🔐 Regras de Negócio

1. **Autenticação**
   - Usuário deve estar logado para acessar sistema
   - Session baseada em cookies

2. **PIX**
   - Valor mínimo: R$ 0,01
   - Saldo suficiente obrigatório
   - Não permite para si mesmo

3. **Detecção de Golpe**
   - Busca transações dos últimos 7 dias
   - Compara: mesmo valor + mesmo remetente
   - Alerta se encontrar padrão

4. **Estorno**
   - Apenas receptor pode estornar
   - Apenas transações completadas
   - Previne duplo estorno
   - Transação atomica (commit/rollback)

## 🐛 Debug e Logs

Para ver logs detalhados:

```powershell
# Modo desenvolvimento (com logs)
npm run dev

# Verificar banco de dados
node ace db:show

# Ver migrations
node ace migration:status
```

## 📝 Próximos Passos (TODOs)

- [ ] Adicionar autenticação 2FA
- [ ] Implementar limites diários de PIX
- [ ] Histórico de alertas ignorados
- [ ] Dashboard administrativo
- [ ] Relatórios de tentativas de golpe
- [ ] Notificações por email/SMS
- [ ] Integração com sistema de score

## 🤝 Contribuindo

Este é um projeto acadêmico. Sugestões e melhorias são bem-vindas!

## 📜 Licença

Projeto acadêmico - Uso educacional

---

**Desenvolvido como projeto acadêmico para demonstrar prevenção de golpes bancários por PIX**
