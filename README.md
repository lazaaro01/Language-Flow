# LinguaFlow AI

Plataforma moderna de aprendizado de inglês com conversas personalizadas por IA, experiência gamificada e exercícios adaptativos.

## Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion, Zustand, React Query
- **Backend:** NestJS, TypeScript, Prisma ORM, SQLite (pronto para PostgreSQL)
- **Autenticação:** JWT com refresh tokens (implementação personalizada em NestJS)
- **Preparado para IA:** Arquitetura preparada para integração com OpenAI, Whisper e ElevenLabs

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Autenticação** | Registro, login, JWT com rotação de refresh token |
| **Dashboard** | Acompanhamento de XP, progressão de nível, sequências (streaks), gráfico de atividade semanal |
| **Módulos de Aprendizado** | Gramática, Vocabulário, Audição, Conversação, Escrita |
| **Exercícios** | Múltipla escolha, preenchimento de lacunas, feedback interativo |
| **Flashcards** | Repetição espaçada (algoritmo SM-2), revisões baseadas em dificuldade |
| **Chat** | Conversas baseadas em cenários (Entrevista, Viagem, Negócios, Tecnologia) |
| **Gamificação** | 10 conquistas, recompensas de XP, sistema de níveis (Iniciante → Fluente) |
| **Ranking** | Leaderboards semanais e gerais |

## Primeiros Passos

### Pré-requisitos

- Node.js 20+
- npm

### Configuração

```bash
# Instalar dependências
npm install

# Configurar banco de dados
cd apps/api
npx prisma db push
npx ts-node prisma/seed.ts
cd ../..

# Iniciar servidores de desenvolvimento
cd apps/api && npm run dev    # API na :3001
cd apps/web && npm run dev    # Frontend na :3000
```

### Variáveis de Ambiente

Copie `.env.example` para `apps/api/.env` e `apps/web/.env.local`:

```bash
cp .env.example apps/api/.env
```

## Estrutura do Projeto

```
lng-flow/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Esquema do banco de dados
│   │   │   └── seed.ts         # Dados iniciais
│   │   └── src/
│   │       ├── auth/           # Módulo de autenticação
│   │       ├── users/          # Perfis de usuário
│   │       ├── progress/       # XP, streaks, dashboard
│   │       ├── lessons/        # Exercícios de aprendizado
│   │       ├── flashcards/     # Repetição espaçada
│   │       ├── chat/           # Conversas
│   │       └── achievements/   # Gamificação e ranking
│   └── web/                    # Frontend Next.js
│       └── src/
│           ├── app/            # Páginas (App Router)
│           ├── components/     # Componentes de UI
│           ├── stores/         # Stores Zustand
│           └── lib/            # Cliente API e utilitários
├── packages/
│   └── shared/                 # Tipos e constantes compartilhados
└── docker-compose.yml          # PostgreSQL e Redis (opcional)
```

## Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Entrar |
| POST | `/api/auth/refresh` | Renovar tokens |
| GET | `/api/auth/me` | Usuário atual |

### Usuários
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/users/profile` | Perfil do usuário com conquistas |
| PATCH | `/api/users/profile` | Atualizar nome, avatar, metas |
| GET | `/api/users/stats` | Estatísticas de aprendizado |

### Progresso
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/progress/dashboard` | Dados do dashboard (XP, streak, gráfico) |
| POST | `/api/progress/xp` | Registrar transação de XP |

### Lições
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/lessons/modules` | Todos os módulos com lições |
| GET | `/api/lessons/module/:name` | Lições por módulo |
| GET | `/api/lessons/:id` | Lição com exercícios |
| POST | `/api/lessons/:id/exercises/:exId/attempt` | Enviar resposta |
| POST | `/api/lessons/:id/complete` | Completar lição |

### Flashcards
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/flashcards` | Todos os flashcards |
| GET | `/api/flashcards/due` | Cartões pendentes de revisão |
| GET | `/api/flashcards/stats` | Estatísticas de flashcards |
| POST | `/api/flashcards` | Criar flashcard |
| POST | `/api/flashcards/:id/review` | Revisar cartão (SM-2) |

### Chat
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/chat/conversations` | Conversas do usuário |
| GET | `/api/chat/scenarios` | Cenários disponíveis |
| GET | `/api/chat/conversations/:id` | Mensagens da conversa |
| POST | `/api/chat/conversations` | Criar conversa |
| POST | `/api/chat/conversations/:id/messages` | Adicionar mensagem |

### Conquistas
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/achievements` | Todas as conquistas (status de desbloqueio) |
| GET | `/api/achievements/ranking` | Ranking geral |
| GET | `/api/achievements/ranking/weekly` | Ranking semanal |

## Migrando para PostgreSQL

1. Atualize `apps/api/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Atualize `apps/api/.env`:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/linguaflow"
   ```
3. Inicie o PostgreSQL: `docker compose up -d`
4. Execute: `npx prisma db push`

---

Desenvolvido por **Lázaro Vasconcelos**
