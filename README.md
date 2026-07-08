# Estoque de Guerra — Foxhole

Ferramenta de gerenciamento de estoque e logística para regimentos de **Foxhole**, feita com **Next.js** (App Router) e **Prisma**.

## Funcionalidades

- **Aba Depósitos**: cadastre locais de depósito no mapa (bunker base, relay station, seaport, etc.), com um cronômetro visual do ciclo de reabastecimento (3 dias) que muda de cor (verde → âmbar → vermelho) conforme o prazo se aproxima, e gerenciamento dos itens armazenados em cada um (adicionar, ajustar quantidade, remover).
- **Aba Quadro de Tarefas**: um kanban simples com as colunas *A Fazer*, *Em Andamento* e *Concluído*, com arrastar e soltar (drag and drop), prioridades e descrição opcional.
- Dados persistidos via **Prisma** (SQLite por padrão — fácil de trocar para Postgres/MySQL).

## Pré-requisitos

- Node.js 20+
- npm

## Configuração inicial

```bash
# 1. Instale as dependências (isso também roda "prisma generate" automaticamente)
npm install

# 2. Crie o banco de dados SQLite e aplique o schema
npx prisma migrate dev --name init

# 3. (Opcional) Popule com dados de exemplo
npm run db:seed

# 4. Rode o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**.

> O arquivo `.env` já vem configurado com `DATABASE_URL="file:./dev.db"` (SQLite local). Não é necessário nenhum serviço externo para rodar o projeto.

> Para habilitar a busca de itens da Foxhole Item API no cadastro de stockpiles, defina também `FOXHOLE_ITEM_API_BASE_URL` com a URL base da instância da API que você estiver usando.

## Trocando para Postgres/MySQL (opcional)

Se quiser usar um banco de verdade (por exemplo para hospedar o app para o regimento inteiro usar), edite:

1. `prisma/schema.prisma` → troque `provider = "sqlite"` por `"postgresql"` (ou `"mysql"`).
2. `.env` → aponte `DATABASE_URL` para a string de conexão do seu banco.
3. Rode `npx prisma migrate dev --name init` novamente.

## Estrutura do projeto

```
prisma/
  schema.prisma       # Modelos: Depot, Item, Task
  seed.mjs            # Dados de exemplo
src/
  app/
    api/
      depots/          # CRUD de depósitos + reset do timer
      items/           # CRUD de itens
      tasks/           # CRUD de tarefas (kanban)
    page.tsx
    layout.tsx
    globals.css
  components/
    AppShell.tsx       # Navegação por abas
    depots/            # UI da aba Depósitos (cards, timer, itens)
    kanban/             # UI da aba Kanban (colunas, cards, drag and drop)
  lib/
    prisma.ts          # Cliente Prisma singleton
    constants.ts        # Duração do refresh, categorias, labels
    types.ts             # Tipos usados no frontend
```

## Modelo de dados

- **Depot**: `name`, `region`, `lastRefillAt` (usado para calcular o cronômetro de 3 dias), `notes`, e sua lista de `items`.
- **Item**: `name`, `quantity`, `category`, vinculado a um `Depot`.
- **Item**: `name`, `quantity`, `category`, `isBoxed`, vinculado a um `Depot`.
- **Task**: `title`, `description`, `status` (`TODO` / `IN_PROGRESS` / `DONE`), `priority` (`LOW` / `MEDIUM` / `HIGH`), `order` (posição dentro da coluna).

O cronômetro de cada depósito é calculado no navegador a partir de `lastRefillAt` + 3 dias — clique no ícone de atualizar no card do depósito sempre que ele for reabastecido no jogo, para reiniciar a contagem.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Roda o build de produção |
| `npm run lint` | Roda o ESLint |
| `npm run db:seed` | Popula o banco com dados de exemplo |
| `npx prisma studio` | Abre uma interface visual para ver/editar os dados diretamente |
