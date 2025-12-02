// src/swagger.ts

import {Express} from "express"
import swaggerUi from "swagger-ui-express"

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "MyFocus API",
        version: "1.0.0",
        description: "API do sistema MyFocus - Gestão Pessoal e Produtividade.",
    },
    servers: [
        {
            url: "http://localhost:3333",
            description: "Ambiente de desenvolvimento",
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
    tags: [
        {name: "Auth", description: "Autenticação"},
        {name: "Users", description: "Usuários (Me & Admin)"},
        {name: "Tasks", description: "Tarefas"},
        {name: "Pomodoro", description: "Sessões de Foco"},
        {name: "Habits", description: "Hábitos"},
        {name: "Goals", description: "Metas"},
        {name: "Notes", description: "Notas"},
        {name: "Moods", description: "Humor"},
        {name: "Quotes", description: "Frases"},
        {name: "Admin", description: "Logs e Estatísticas"},
        {name: "News", description: "Notícias de produtividade"},
    ],
    paths: {
        // ==========================
        // AUTH
        // ==========================
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Registrar novo usuário",
                security: [], // Public
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "email", "password"],
                                properties: {
                                    name: {type: "string"},
                                    email: {type: "string"},
                                    password: {type: "string"},
                                    avatar: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Usuário criado com sucesso"},
                    400: {description: "Dados inválidos"}, // ✅ casa com validações simples
                    409: {description: "Email já registrado"},
                },
            },
        },
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login",
                security: [], // Public
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: {type: "string"},
                                    password: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Retorna Token JWT e dados do usuário"},
                    400: {description: "Credenciais inválidas (payload incompleto)"},
                    401: {description: "Credenciais inválidas (email/senha incorretos)"},
                },
            },
        },
        "/auth/forgot-password": {
            post: {
                tags: ["Auth"],
                summary: "Esqueci minha senha",
                security: [],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email"],
                                properties: {email: {type: "string"}},
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Email de recuperação enviado"},
                    400: {description: "Email é obrigatório"},
                    404: {description: "Usuário não encontrado"},
                },
            },
        },
        "/auth/reset-password": {
            post: {
                tags: ["Auth"],
                summary: "Redefinir senha (com token)",
                security: [],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["token", "newPassword"],
                                properties: {
                                    token: {type: "string"},
                                    newPassword: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Senha alterada com sucesso"},
                    400: {description: "Token inválido ou expirado"},
                    404: {description: "Usuário não encontrado"},
                },
            },
        },

        // ✅ NOVA ROTA: AUTH /ME (authenticate + getCurrentUser)
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Dados do usuário autenticado",
                description:
                    "Retorna os dados do usuário autenticado (via token) com estatísticas de Pomodoro (totalSessions, totalDuration).",
                responses: {
                    200: {description: "Dados do usuário autenticado"},
                    401: {description: "Não autenticado ou token inválido"},
                },
            },
        },

        // ==========================
        // USERS (ME)
        // ==========================
        "/users/me": {
            get: {
                tags: ["Users"],
                summary: "Dados do usuário logado",
                responses: {
                    200: {description: "Perfil do usuário + flags de isAdmin / isLastAdmin"},
                    401: {description: "Não autenticado"},
                },
            },
            put: {
                tags: ["Users"],
                summary: "Atualizar meu perfil",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {type: "string"},
                                    email: {type: "string"},
                                    avatar: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Perfil atualizado"},
                    400: {description: "Dados inválidos"},
                    401: {description: "Não autenticado"},
                    409: {description: "Email já em uso por outro usuário"},
                },
            },
            delete: {
                tags: ["Users"],
                summary: "Excluir minha conta",
                responses: {
                    204: {description: "Conta excluída"},
                    400: {
                        description:
                            "Você é o último administrador do sistema e não pode excluir sua própria conta.",
                    },
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/users/me/password": {
            put: {
                tags: ["Users"],
                summary: "Alterar senha (estando logado)",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["currentPassword", "newPassword"],
                                properties: {
                                    currentPassword: {type: "string"},
                                    newPassword: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Senha alterada"},
                    400: {description: "Campos obrigatórios não preenchidos"},
                    401: {description: "Não autenticado ou senha atual incorreta"},
                    404: {description: "Usuário não encontrado"},
                },
            },
        },
        "/users/me/stats": {
            get: {
                tags: ["Users"],
                summary: "Estatísticas pessoais (foco, tarefas, streak)",
                responses: {
                    200: {description: "Objeto com estatísticas"},
                    401: {description: "Não autenticado"},
                    500: {description: "Erro ao buscar estatísticas"},
                },
            },
        },
        "/users/me/export": {
            get: {
                tags: ["Users"],
                summary: "Exportar todos os dados (JSON)",
                description:
                    "Exporta todos os dados pessoais do usuário autenticado em um arquivo JSON (conteúdo mascarado para email).",
                responses: {
                    200: {description: "Download do arquivo JSON com os dados pessoais"},
                    401: {description: "Não autenticado"},
                    404: {description: "Usuário não encontrado"},
                },
            },
        },

        // ==========================
        // USERS (ADMIN)
        // ==========================
        "/users": {
            get: {
                tags: ["Users"],
                summary: "Listar usuários (Admin)",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Número da página (começa em 1)",
                        schema: {type: "integer", default: 1, minimum: 1}, // ✅
                    },
                    {
                        name: "limit",
                        in: "query",
                        description: "Quantidade de itens por página",
                        schema: {type: "integer", default: 10, minimum: 1, maximum: 100}, // ✅
                    },
                ],
                responses: {
                    200: {description: "Lista paginada de usuários"},
                    401: {description: "Não autenticado"},
                    403: {description: "Apenas administradores podem acessar"},
                },
            },
            post: {
                tags: ["Users"],
                summary: "Criar usuário (Admin)",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "email", "password", "type"],
                                properties: {
                                    name: {type: "string"},
                                    email: {type: "string"},
                                    password: {type: "string"},
                                    type: {type: "string", enum: ["admin", "user"]},
                                    avatar: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Usuário criado"},
                    400: {description: "Dados inválidos"},
                    401: {description: "Não autenticado"},
                    403: {description: "Apenas administradores podem criar usuários"},
                    409: {description: "Email já registrado"},
                },
            },
        },
        "/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Ver usuário por ID (Admin)",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    200: {description: "Dados do usuário"},
                    401: {description: "Não autenticado"},
                    403: {description: "Apenas administradores podem acessar"},
                    404: {description: "Usuário não encontrado"},
                },
            },
            put: {
                tags: ["Users"],
                summary: "Editar usuário (Admin)",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {type: "string"},
                                    email: {type: "string"},
                                    type: {type: "string", enum: ["admin", "user"]},
                                    avatar: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Atualizado"},
                    401: {description: "Não autenticado"},
                    403: {description: "Apenas administradores podem editar usuários"},
                    404: {description: "Usuário não encontrado"},
                    409: {description: "Email já em uso"},
                },
            },
            delete: {
                tags: ["Users"],
                summary: "Deletar usuário (Admin)",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    204: {description: "Deletado"},
                    400: {description: "Não é possível excluir o último administrador"},
                    401: {description: "Não autenticado"},
                    403: {description: "Apenas administradores podem excluir usuários"},
                    404: {description: "Usuário não encontrado"},
                },
            },
        },

        // ==========================
        // TASKS
        // ==========================
        "/tasks": {
            get: {
                tags: ["Tasks"],
                summary: "Listar tarefas do usuário",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Número da página (começa em 1)",
                        schema: {type: "integer", default: 1, minimum: 1}, // ✅
                    },
                    {
                        name: "limit",
                        in: "query",
                        description: "Quantidade de itens por página",
                        schema: {type: "integer", default: 10, minimum: 1, maximum: 100}, // ✅
                    },
                ],
                responses: {
                    200: {description: "Lista de tarefas paginada"},
                    401: {description: "Não autenticado"},
                },
            },
            post: {
                tags: ["Tasks"],
                summary: "Criar tarefa",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title"],
                                properties: {
                                    title: {type: "string"},
                                    description: {type: "string"},
                                    priority: {type: "string", enum: ["low", "medium", "high"]},
                                    dueDate: {type: "string", format: "date-time"},
                                    tags: {type: "array", items: {type: "string"}},
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Tarefa criada"},
                    400: {description: "Dados inválidos"},
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/tasks/today-summary": {
            get: {
                tags: ["Tasks"],
                summary: "Resumo do dia (Tarefas + Foco estimado)",
                responses: {
                    200: {description: "Resumo com tarefas de hoje"},
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/tasks/{id}": {
            get: {
                tags: ["Tasks"],
                summary: "Detalhes da tarefa",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    200: {description: "Tarefa encontrada"},
                    401: {description: "Não autenticado"},
                    404: {description: "Tarefa não encontrada"},
                },
            },
            put: {
                tags: ["Tasks"],
                summary: "Atualizar tarefa",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: {type: "string"},
                                    description: {type: "string"},
                                    completed: {type: "boolean"},
                                    priority: {type: "string"},
                                    dueDate: {type: "string", format: "date-time"},
                                    tags: {type: "array", items: {type: "string"}},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Atualizada"},
                    401: {description: "Não autenticado"},
                    404: {description: "Tarefa não encontrada"},
                },
            },
            delete: {
                tags: ["Tasks"],
                summary: "Remover tarefa",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    204: {description: "Removida"},
                    401: {description: "Não autenticado"},
                    404: {description: "Tarefa não encontrada"},
                },
            },
        },

        // ==========================
        // POMODORO
        // ==========================
        "/pomodoro": {
            get: {
                tags: ["Pomodoro"],
                summary: "Histórico de sessões do usuário",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Número da página (começa em 1)",
                        schema: {type: "integer", default: 1, minimum: 1}, // ✅
                    },
                    {
                        name: "limit",
                        in: "query",
                        description: "Quantidade de itens por página",
                        schema: {type: "integer", default: 10, minimum: 1, maximum: 100}, // ✅
                    },
                ],
                responses: {
                    200: {description: "Histórico paginado"},
                    401: {description: "Não autenticado"},
                },
            },
            post: {
                tags: ["Pomodoro"],
                summary: "Salvar nova sessão",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["duration", "type"],
                                properties: {
                                    duration: {
                                        type: "integer",
                                        description: "Duração em minutos",
                                    },
                                    type: {
                                        type: "string",
                                        enum: ["work", "break", "longBreak"],
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Sessão salva"},
                    400: {description: "Dados inválidos"},
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/pomodoro/pomodoro-sumary": {
            get: {
                tags: ["Pomodoro"],
                summary: "Totalizadores de foco",
                responses: {
                    200: {
                        description: "Total de sessões e minutos de foco do usuário",
                    },
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/pomodoro/{id}": {
            put: {
                tags: ["Pomodoro"],
                summary: "Atualizar sessão (ex: marcar completed)",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    completed: {type: "boolean"},
                                    endTime: {type: "string", format: "date-time"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Atualizado"},
                    401: {description: "Não autenticado"},
                    404: {description: "Sessão não encontrada"},
                },
            },
            delete: {
                tags: ["Pomodoro"],
                summary: "Remover sessão",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    204: {description: "Removido"},
                    401: {description: "Não autenticado"},
                    404: {description: "Sessão não encontrada"},
                },
            },
        },

        // ==========================
        // HABITS
        // ==========================
        "/habits": {
            get: {
                tags: ["Habits"],
                summary: "Listar hábitos (com status de hoje)",
                responses: {
                    200: {description: "Lista de hábitos com flag completedToday"},
                    401: {description: "Não autenticado"},
                },
            },
            post: {
                tags: ["Habits"],
                summary: "Criar hábito",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "description", "color"],
                                properties: {
                                    name: {type: "string"},
                                    description: {type: "string"},
                                    color: {type: "string"},
                                    category: {type: "string"},
                                    weeklyGoal: {type: "integer", default: 7},
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Hábito criado"},
                    400: {description: "Limite de 10 hábitos atingido ou dados inválidos"}, // ✅
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/habits/today-summary": {
            get: {
                tags: ["Habits"],
                summary: "Resumo do dia (Hábitos)",
                responses: {
                    200: {description: "Progresso dos hábitos de hoje"},
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/habits/{id}/checkin": {
            post: {
                tags: ["Habits"],
                summary: "Toggle Check-in (Marcar/Desmarcar)",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    200: {
                        description: "Retorna novo status (checked/unchecked)",
                    },
                    401: {description: "Não autenticado"},
                    404: {description: "Hábito não encontrado"},
                },
            },
        },
        "/habits/{id}": {
            put: {
                tags: ["Habits"],
                summary: "Editar hábito",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {type: "string"},
                                    description: {type: "string"},
                                    color: {type: "string"},
                                    weeklyGoal: {type: "integer"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Atualizado"},
                    401: {description: "Não autenticado"},
                    404: {
                        description: "Hábito não encontrado ou acesso negado",
                    },
                },
            },
            delete: {
                tags: ["Habits"],
                summary: "Remover hábito",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    204: {description: "Removido"},
                    401: {description: "Não autenticado"},
                    404: {
                        description: "Hábito não encontrado ou acesso negado",
                    },
                },
            },
        },

        // ==========================
        // GOALS
        // ==========================
        "/goals": {
            get: {
                tags: ["Goals"],
                summary: "Listar metas do usuário",
                responses: {
                    200: {description: "Lista de metas"},
                    401: {description: "Não autenticado"},
                },
            },
            post: {
                tags: ["Goals"],
                summary: "Criar meta",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "description", "targetDate"],
                                properties: {
                                    title: {type: "string"},
                                    description: {type: "string"},
                                    targetDate: {type: "string", format: "date-time"},
                                    type: {type: "string"},
                                    category: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Criada"},
                    400: {description: "Limite de 8 metas atingido ou dados inválidos"}, // ✅
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/goals/{id}": {
            put: {
                tags: ["Goals"],
                summary: "Atualizar meta (progresso, etc)",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: {type: "string"},
                                    progress: {type: "integer"},
                                    completed: {type: "boolean"},
                                    targetDate: {type: "string", format: "date-time"},
                                    description: {type: "string"},
                                    type: {type: "string"},
                                    category: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Atualizada"},
                    401: {description: "Não autenticado"},
                    403: {description: "Acesso negado"},
                    404: {description: "Meta não encontrada"},
                },
            },
            delete: {
                tags: ["Goals"],
                summary: "Remover meta",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    204: {description: "Removida"},
                    401: {description: "Não autenticado"},
                    403: {description: "Acesso negado"},
                    404: {description: "Meta não encontrada"},
                },
            },
        },

        // ==========================
        // NOTES
        // ==========================
        "/notes": {
            get: {
                tags: ["Notes"],
                summary: "Listar notas",
                responses: {
                    200: {description: "Lista de notas (ordenadas por pinned e updatedAt)"},
                    401: {description: "Não autenticado"},
                },
            },
            post: {
                tags: ["Notes"],
                summary: "Criar nota",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "content"],
                                properties: {
                                    title: {type: "string"},
                                    content: {type: "string"},
                                    color: {type: "string"},
                                    pinned: {type: "boolean"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Criada"},
                    400: {description: "Limite de 10 anotações atingido ou dados inválidos"}, // ✅
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/notes/{id}": {
            put: {
                tags: ["Notes"],
                summary: "Atualizar nota",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: {type: "string"},
                                    content: {type: "string"},
                                    color: {type: "string"},
                                    pinned: {type: "boolean"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Atualizada"},
                    401: {description: "Não autenticado"},
                    403: {description: "Acesso negado"},
                    404: {description: "Nota não encontrada"},
                },
            },
            delete: {
                tags: ["Notes"],
                summary: "Remover nota",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    204: {description: "Removida"},
                    401: {description: "Não autenticado"},
                    403: {description: "Acesso negado"},
                    404: {description: "Nota não encontrada"},
                },
            },
        },

        // ==========================
        // MOODS
        // ==========================
        "/moods": {
            get: {
                tags: ["Moods"],
                summary: "Listar humor (últimos 7 dias)",
                responses: {
                    200: {description: "Histórico de humor + stats da última semana"},
                    401: {description: "Não autenticado"},
                },
            },
            post: {
                tags: ["Moods"],
                summary: "Registrar/atualizar humor de hoje",
                description:
                    "Cria ou atualiza o registro de humor do dia. Há limite de 7 registros totais.",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["mood"],
                                properties: {
                                    mood: {type: "string", enum: ["happy", "neutral", "sad"]},
                                    note: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Humor criado ou atualizado para o dia"},
                    400: {description: "Limite de 7 registros atingido ou dados inválidos"}, // ✅
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/moods/{id}": {
            put: {
                tags: ["Moods"],
                summary: "Atualizar registro",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    mood: {type: "string", enum: ["happy", "neutral", "sad"]},
                                    note: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Atualizado"},
                    401: {description: "Não autenticado"},
                    403: {description: "Acesso negado"},
                    404: {description: "Registro não encontrado"},
                },
            },
            delete: {
                tags: ["Moods"],
                summary: "Remover registro",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    204: {description: "Removido"},
                    401: {description: "Não autenticado"},
                    403: {description: "Acesso negado"},
                    404: {description: "Registro não encontrado"},
                },
            },
        },

        // ==========================
        // QUOTES
        // ==========================
        "/quotes": {
            get: {
                tags: ["Quotes"],
                summary: "Listar frases (Sistema + Usuário)",
                responses: {
                    200: {
                        description: "Lista de frases do sistema e frases do usuário",
                    },
                    401: {description: "Não autenticado"},
                },
            },
            post: {
                tags: ["Quotes"],
                summary: "Criar frase pessoal",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["text"],
                                properties: {
                                    text: {type: "string"},
                                    author: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {description: "Frase criada"},
                    400: {description: "Limite de 5 frases atingido ou dados inválidos"}, // ✅
                    401: {description: "Não autenticado"},
                },
            },
        },
        "/quotes/{id}": {
            put: {
                tags: ["Quotes"],
                summary: "Atualizar frase",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    text: {type: "string"},
                                    author: {type: "string"},
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {description: "Atualizada"},
                    401: {description: "Não autenticado"},
                    403: {description: "Acesso negado"},
                    404: {description: "Frase não encontrada"},
                },
            },
            delete: {
                tags: ["Quotes"],
                summary: "Remover frase",
                parameters: [
                    {name: "id", in: "path", required: true, schema: {type: "string"}},
                ],
                responses: {
                    204: {description: "Removida"},
                    401: {description: "Não autenticado"},
                    403: {description: "Acesso negado"},
                    404: {description: "Frase não encontrada"},
                },
            },
        },

        // ==========================
        // NEWS
        // ==========================
        "/news/productivity": {
            get: {
                tags: ["News"],
                summary: "Listar notícias sobre produtividade",
                description:
                    "Consulta a NewsAPI (API externa) usando filtros relacionados a foco, organização pessoal e gestão de tempo, remove propagandas/e-commerce e devolve uma lista paginada de notícias normalizadas.",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Número da página (começa em 1)",
                        schema: {type: "integer", default: 1, minimum: 1},
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        description: "Quantidade de itens por página (máx. 20)",
                        schema: {type: "integer", default: 5, minimum: 1, maximum: 20},
                    },
                    {
                        name: "q",
                        in: "query",
                        description:
                            "Termo opcional para refinar a busca. Se não informado, é usado o filtro padrão do servidor (produtividade, gestão de tempo, organização pessoal, etc).",
                        schema: {type: "string"},
                    },
                ],
                responses: {
                    200: {
                        description:
                            "Lista paginada de notícias (total, page, pageSize, articles). Cada notícia inclui título, descrição, URL, fonte, data de publicação e imagem (quando disponível).",
                    },
                    500: {
                        description:
                            "Erro interno ao acessar a NewsAPI ou ao processar as notícias.",
                    },
                    502: {
                        description: "Falha ao acessar a NewsAPI (erro de upstream).",
                    },
                },
            },
        },


        // ==========================
        // ADMIN & ACTIVITY LOGS
        // ==========================
        "/admin/stats": {
            get: {
                tags: ["Admin"],
                summary: "Dashboard Admin Stats",
                description:
                    "Retorna estatísticas gerais do sistema: total de usuários, tarefas, sessões Pomodoro, usuários ativos, novos usuários no mês, tarefas concluídas hoje, engajamento e últimas atividades.",
                responses: {
                    200: {description: "Dados gerais do sistema"},
                    401: {description: "Não autenticado"},
                    403: {description: "Apenas administradores podem acessar"},
                },
            },
        },
        "/activities": {
            get: {
                tags: ["Admin"],
                summary: "Logs de atividade (Todos)",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Número da página (começa em 1)",
                        schema: {type: "integer", default: 1, minimum: 1}, // ✅
                    },
                    {
                        name: "limit",
                        in: "query",
                        description: "Quantidade de itens por página",
                        schema: {type: "integer", default: 20, minimum: 1, maximum: 100}, // ✅
                    },
                    {
                        name: "type",
                        in: "query",
                        description: "Filtrar por tipo de atividade",
                        schema: {
                            type: "string",
                            enum: ["user", "task", "pomodoro", "system", "goal"], // ✅ casa com controller
                        },
                    },
                ],
                responses: {
                    200: {
                        description:
                            "Logs paginados com total global e contagem por tipo de atividade",
                    },
                    401: {description: "Não autenticado"},
                    403: {description: "Apenas administradores podem acessar"},
                },
            },
        },
        "/activities/{userId}": {
            get: {
                tags: ["Admin"],
                summary: "Logs por usuário",
                parameters: [
                    {
                        name: "userId",
                        in: "path",
                        required: true,
                        schema: {type: "string"},
                    },
                ],
                responses: {
                    200: {description: "Lista de logs do usuário (emails mascarados)"},
                    401: {description: "Não autenticado"},
                    403: {description: "Apenas administradores podem acessar"},
                },
            },
        },
    },
} as const

export function setupSwagger(app: Express) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
