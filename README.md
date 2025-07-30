# 🧠 MyFocus

MyFocus é uma aplicação de produtividade pessoal desenvolvida para ajudar usuários a organizarem sua rotina de forma prática e eficiente. Com funcionalidades como Pomodoro, tarefas, metas e mais, o sistema combina simplicidade, design moderno e recursos úteis em um só lugar.

---

## 📌 Descrição

O MyFocus é uma aplicação fullstack com estrutura em monorepo, contendo frontend em React e backend em Node.js. Seu objetivo é centralizar o gerenciamento da vida pessoal do usuário, com foco em produtividade, saúde mental e bem-estar.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React**
- **Vite**
- **TailwindCSS**
- **TypeScript**
- **Sonner** (toasts)

### Backend
- **Express**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (autenticação)
- **Nodemailer** (e-mails)

---

## ⚙️ Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/myfocus.git
cd myfocus
```

### 2. Configure as variáveis de ambiente

Crie dois arquivos `.env`:

#### 📁 apps/backend/.env
```env
DATABASE_URL="postgresql://seu_usuario:senha@localhost:5432/myfocus?schema=public"
JWT_SECRET="sua_chave_secreta"
EMAIL_FROM="seu@email.com"
EMAIL_PASS="senha_do_app_email"
```

#### 📁 apps/frontend/.env
```env
VITE_API_URL=http://localhost:4000
```

### 3. Instale as dependências e gere os arquivos do Prisma

```bash
npm install
```

### 4. Rode a aplicação em modo desenvolvimento

```bash
npm run dev
```

Acesse:
- **Frontend:** http://localhost:5173  
- **Backend:** http://localhost:4000

---

## 🗂️ Estrutura de Pastas

```
myfocus/
│
├── apps/
│   ├── frontend/     # Interface com React + Vite
│   └── backend/      # API com Express + Prisma
│
├── package.json      # Scripts globais
└── README.md
```

---

## 📦 Scripts Disponíveis

```json
"scripts": {
  "install:all": "npm --prefix apps/frontend install && npm --prefix apps/backend install",
  "postinstall": "npm run install:all && npm --prefix apps/backend run generate",
  "dev": "concurrently \"npm run dev:back\" \"npm run dev:front\"",
  "dev:front": "npm --prefix apps/frontend run dev",
  "dev:back": "npm --prefix apps/backend run dev",
  "build:all": "npm --prefix apps/frontend run build && npm --prefix apps/backend run build",
  "prod": "concurrently \"npm run prod:back\" \"npm run prod:front\"",
  "prod:front": "npm --prefix apps/frontend run prod",
  "prod:back": "npm --prefix apps/backend run prod"
}
```

---

## 🔐 .env.example

### Backend (`apps/backend/.env`)
```env
DATABASE_URL="postgresql://seu_usuario:senha@localhost:5432/myfocus?schema=public"
JWT_SECRET="sua_chave_secreta"
EMAIL_FROM="seu@email.com"
EMAIL_PASS="senha_do_app_email"
```

### Frontend (`apps/frontend/.env`)
```env
VITE_API_URL=http://localhost:4000
```

---

## ✅ Funcionalidades

- Login e registro de usuários com JWT
- Sessões Pomodoro com histórico
- Lista de tarefas com filtros e status
- Sistema de hábitos com streak
- Metas pessoais com CRUD completo
- Anotações com fixação e cores
- Registro de humor (MoodLog)
- Estatísticas personalizadas do usuário
- Envio de e-mail para recuperação de senha
- Upload de imagem de perfil

---

## 🎯 Objetivo

Ajudar pessoas a organizarem melhor seu tempo, tarefas e hábitos, promovendo o foco e o bem-estar, por meio de uma ferramenta digital intuitiva e responsiva.

---



