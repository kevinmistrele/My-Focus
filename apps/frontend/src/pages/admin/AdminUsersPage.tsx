import React, {useEffect, useState} from "react"
import {Card} from "../../components/ui/Card"
import {Button} from "../../components/ui/Button"
import {Input} from "../../components/ui/Input"
import {Modal} from "../../components/ui/Modal"
import {ConfirmModal} from "../../components/ui/ConfirmModal"
import type {User} from "../../lib/types"
import {UserService} from "../../services";
import {toast} from "sonner";

export const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)


    const [filter, setFilter] = useState<"all" | "user" | "admin">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        type: "user" as "user" | "admin",
    })

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info" as "danger" | "warning" | "info",
        onConfirm: () => {},
    })

    const filteredUsers = users.filter((user) => {
        const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase())
        const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const searchMatch = searchTerm === "" || nameMatch || emailMatch

        const typeMatch = filter === "all" || user.type === filter

        return searchMatch && typeMatch
    })

    const maskEmail = (email: string) => {
        const [localPart, domain] = email.split("@")
        if (!localPart || !domain) return email

        // mantém só os 2 primeiros caracteres e o resto vira *
        const visible = localPart.slice(0, 2)
        const masked = "*".repeat(Math.max(localPart.length - 2, 0))

        return `${visible}${masked}@${domain}`
    }

    const fetchUsers = async (page = 1) => {
        try {
            const res = await UserService.getAll({ page, limit: 10 })
            const usersData = res?.data

            if (!Array.isArray(usersData)) {
                toast.error("Formato de resposta inesperado da API")
            }

            const parsedUsers: User[] = usersData.map((user: any) => ({
                ...user,
                type: (user.type || "user").toLowerCase(),
                createdAt: new Date(user.createdAt),
                lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
            }))

            setUsers(parsedUsers)
            setTotalPages(res?.totalPages || 1)
            setCurrentPage(page)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }





    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) return

        try {
            const createdUserRaw = await UserService.create(newUser)

            if (!createdUserRaw) {
                console.error("Resposta da API está vazia")
                return
            }

            const createdUser: User = {
                ...createdUserRaw,
                type: (createdUserRaw.type || "user").toLowerCase(),
                createdAt: new Date(createdUserRaw.createdAt),
                lastLogin: createdUserRaw.lastLogin ? new Date(createdUserRaw.lastLogin) : null,
            }

            setUsers((prev) => [createdUser, ...prev])
            setNewUser({ name: "", email: "", password: "", type: "user" })
            setIsCreateModalOpen(false)
        } catch (err) {
            console.error("Erro ao criar usuário:", err)
        }
    }


    useEffect(() => {
        fetchUsers(currentPage)
    }, [currentPage])

    const handleDeleteUser = (user: User) => {
        setConfirmModal({
            isOpen: true,
            title: "Excluir Usuário",
            message: `Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`,
            type: "danger",
            onConfirm: async () => {
                try {
                    await UserService.delete(user.id)

                    setUsers((prev) => prev.filter((u) => u.id !== user.id))

                    setEditingUser((prev) => (prev?.id === user.id ? null : prev))
                    setSelectedUser((prev) => (prev?.id === user.id ? null : prev))
                    setIsEditModalOpen(false)
                    setIsViewModalOpen(false)

                    toast.success("Usuário excluído com sucesso!")
                } catch (err) {
                    console.error("Erro ao excluir usuário:", err)
                    toast.error("Erro ao excluir usuário.")
                } finally {
                    setConfirmModal((prev) => ({
                        ...prev,
                        isOpen: false,
                        onConfirm: () => {},
                    }))
                }
            },
        })
    }
    const handleViewUser = (user: User) => {
        setSelectedUser(user)
        setIsViewModalOpen(true)
    }

    const handleEditUser = (user: User) => {
        setEditingUser({ ...user })
        setIsEditModalOpen(true)
    }

    const handleSaveEditUser = async () => {
        if (!editingUser) return

        try {
            // só o que pode ser alterado
            const payload = {
                name: editingUser.name,
                type: editingUser.type,
            }

            const res = await UserService.update(editingUser.id, payload)

            if (!res) {
                toast.error("Erro ao editar usuário.")
                return
            }

            const updated: User = {
                ...editingUser,          // mantém email atual
                ...res,                  // atualiza campos vindos da API
                createdAt: new Date(res.createdAt),
                lastLogin: res.lastLogin ? new Date(res.lastLogin) : null,
            }

            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
            setEditingUser(null)
            setIsEditModalOpen(false)
            setIsViewModalOpen(false)
            setSelectedUser(null)

            toast.success("Usuário atualizado com sucesso!")
        } catch (err) {
            toast.error("Erro ao editar usuário.")
        }
    }


    const getUserTypeColor = (type: string) => {
        return type === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
    }

    const getUserTypeLabel = (type: string) => {
        return type === "admin" ? "Admin" : "Usuário"
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Gerenciar Usuários</h1>
                    <p className="text-secondary mt-1">Visualize e gerencie todos os usuários do sistema</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-purple">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Criar Usuário
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{users.length}</div>
                        <div className="text-sm text-secondary">Total de Usuários</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">{users.filter((u) => u.type === "admin").length}</div>
                        <div className="text-sm text-secondary">Administradores</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{users.filter((u) => u.type === "user").length}</div>
                        <div className="text-sm text-secondary">Usuários Comuns</div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        placeholder="Buscar usuários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        }
                    />
                    <div className="flex space-x-2">
                        {(["all", "user", "admin"] as const).map((filterType) => (
                            <Button
                                key={filterType}
                                variant={filter === filterType ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setFilter(filterType)}
                            >
                                {filterType === "all" ? "Todos" : filterType === "user" ? "Usuários" : "Admins"}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-custom">
                            <th className="text-left py-3 px-4 font-medium text-secondary">Usuário</th>
                            <th className="text-left py-3 px-4 font-medium text-secondary">Email</th>
                            <th className="text-left py-3 px-4 font-medium text-secondary">Tipo</th>
                            <th className="text-left py-3 px-4 font-medium text-secondary">Criado em</th>
                            <th className="text-left py-3 px-4 font-medium text-secondary">Último Login</th>
                            <th className="text-right py-3 px-4 font-medium text-secondary">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user) => {

                            return (
                                <tr key={user.id} className="border-b border-custom hover:bg-surface-light transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <span className="font-medium text-primary">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-secondary">{maskEmail(user.email)}</td>
                                    <td className="py-3 px-4">
          <span className={`px-2 py-1 rounded-full text-xs ${getUserTypeColor(user.type)}`}>
            {getUserTypeLabel(user.type)}
          </span>
                                    </td>
                                    <td className="py-3 px-4 text-secondary">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "-"}
                                    </td>
                                    <td className="py-3 px-4 text-secondary">
                                        {user.lastLogin ? user.lastLogin.toLocaleDateString("pt-BR") : "Nunca"}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-lg font-medium text-secondary mb-2">Nenhum usuário encontrado</h3>
                        <p className="text-muted">Tente ajustar os filtros ou criar um novo usuário</p>
                    </div>
                )}
            </Card>

            <div className="flex justify-center mt-6 space-x-2">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                    Anterior
                </Button>
                <span className="text-primary px-4 pt-2">Página {currentPage} de {totalPages}</span>
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                    Próxima
                </Button>
            </div>

            {/* Create User Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Criar Novo Usuário"
                size="lg"
            >
                <div className="space-y-4">
                    <Input
                        label="Nome completo"
                        placeholder="Digite o nome do usuário"
                        value={newUser.name}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Digite o email do usuário"
                        value={newUser.email}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                        required
                    />

                    <Input
                        label="Senha"
                        type="password"
                        placeholder="Digite a senha inicial"
                        value={newUser.password}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Tipo de usuário</label>
                        <select
                            value={newUser.type}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, type: e.target.value as "user" | "admin" }))}
                            className="w-full px-3 py-2 bg-surface text-primary rounded-lg border border-custom focus:border-primary transition-colors duration-200 focus-ring"
                        >
                            <option value="user">Usuário Comum</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateUser}>Criar Usuário</Button>
                    </div>
                </div>
            </Modal>

            {/* View User Modal */}
            {selectedUser && (
                <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detalhes do Usuário" size="lg">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-white text-xl font-medium">{selectedUser.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-primary">{selectedUser.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getUserTypeColor(selectedUser.type)}`}>
                    {getUserTypeLabel(selectedUser.type)}
                  </span>
                                </div>
                            </div>
                            <Button variant="outline" onClick={() => handleEditUser(selectedUser)} className="bg-transparent">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Editar
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Data de Criação</label>
                                <p className="text-primary">{selectedUser.createdAt.toLocaleDateString("pt-BR")}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Último Login</label>
                                <p className="text-primary">
                                    {selectedUser.lastLogin ? selectedUser.lastLogin.toLocaleDateString("pt-BR") : "Nunca"}
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Usuário" size="lg">
                    <div className="space-y-4">
                        <Input
                            label="Nome completo"
                            placeholder="Digite o nome do usuário"
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Tipo de usuário</label>
                            <select
                                value={editingUser.type}
                                onChange={(e) => setEditingUser({ ...editingUser, type: e.target.value as "user" | "admin" })}
                                className="w-full px-3 py-2 bg-surface text-primary rounded-lg border border-custom focus:border-primary transition-colors duration-200 focus-ring"
                            >
                                <option value="user">Usuário Comum</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <div className="flex justify-between pt-4">
                            <div className="flex space-x-2">
                                <Button variant="danger" onClick={() => handleDeleteUser(editingUser)}>
                                    Excluir Usuário
                                </Button>
                            </div>
                            <div className="flex space-x-4">
                                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleSaveEditUser}>Salvar Alterações</Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.type === "danger" ? "Excluir" : "Confirmar"}
            />
        </div>
    )
}
