import type React from "react"
import {useEffect, useState} from "react"
import {Card} from "../components/ui/Card"
import {Button} from "../components/ui/Button"
import {Input} from "../components/ui/Input"
import {Modal} from "../components/ui/Modal"
import {UserService} from "../services"
import {toast} from "sonner";

export const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any | null>(null)
    const [formData, setFormData] = useState({ name: "", email: "" })
    const [isExporting, setIsExporting] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" })
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showTermsModal, setShowTermsModal] = useState(false)
    const [showPrivacyModal, setShowPrivacyModal] = useState(false)
    const [showLGPDModal, setShowLGPDModal] = useState(false)
    const [isLoadingSave, setIsLoadingSave] = useState(false)
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)
    const [isLoadingPassword, setIsLoadingPassword] = useState(false)


    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const data = await UserService.getCurrent()
            if (!data || !data.createdAt) {
                toast.error("Erro: dados de usuário inválidos.")
                return
            }

            const stats = await UserService.getStats()
            setUser({
                ...data,
                joinDate: new Date(data.createdAt),
                stats,
            })

            setFormData({ name: data.name, email: data.email })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Erro ao carregar dados do usuário.")
        }
    }


    const handleSave = async () => {
        setIsLoadingSave(true)
        try {
            await UserService.updateCurrent(formData)
            setUser((prev: any) => ({
                ...prev,
                name: formData.name,
                email: formData.email,
            }))
            toast.success("Perfil atualizado com sucesso!")
            setIsEditing(false)
        } catch {
            toast.error("Erro ao atualizar perfil.")
        } finally {
            setIsLoadingSave(false)
        }
    }



    const handleDeleteAccount = async () => {
        setIsLoadingDelete(true)
        try {
            await UserService.deleteCurrent()
            toast.success("Conta excluída com sucesso.")
            setShowDeleteModal(false)
            window.location.href = "/login"
        } catch {
            toast.error("Erro ao excluir conta.")
        } finally {
            setIsLoadingDelete(false)
        }
    }


    const exportUserData = async () => {
        try {
            setIsExporting(true)

            const response = await UserService.exportData()

            let blob: Blob

            if (response instanceof Blob) {
                blob = response
            } else if (response && response.data instanceof Blob) {
                blob = response.data
            } else {
                // fallback: se por algum motivo vier JSON normal, converte pra Blob
                blob = new Blob(
                    [typeof response === "string" ? response : JSON.stringify(response, null, 2)],
                    {type: "application/json;charset=utf-8"},
                )
            }

            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "myfocus-dados-pessoais.json"

            document.body.appendChild(link)
            link.click()
            link.remove()

            URL.revokeObjectURL(url)

            toast.success("Dados exportados com sucesso!")
        } catch (error) {
            console.error("Erro ao exportar dados:", error)
            toast.error("Erro ao exportar dados.")
        } finally {
            setIsExporting(false)
        }
    }

    if (!user) {
        return <div className="text-center text-secondary mt-10">Carregando perfil...</div>
    }



    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Perfil</h1>
                    <p className="text-secondary mt-1">Gerencie suas informações pessoais</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-center space-x-6 mb-6">
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                                {user.avatar ? (
                                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-20 h-20 rounded-full" />
                                ) : (
                                    <span className="text-2xl font-bold text-white">
                    {user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                  </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
                                <p className="text-secondary">{user.email}</p>
                                <p className="text-muted text-sm">
                                    Membro desde{" "}
                                    {user.joinDate.toLocaleDateString("pt-BR", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                Editar
                            </Button>
                        </div>

                        {isEditing && (
                            <div className="space-y-4 pt-4 border-t border-custom">
                                <Input
                                    label="Nome"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                />
                                <div className="flex space-x-3">
                                    <Button onClick={handleSave} loading={isLoadingSave}>Salvar</Button>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Account Actions */}
                    <Card>
                        <h3 className="text-lg font-semibold text-primary mb-4">Ações da Conta</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                                <div>
                                    <h4 className="font-medium text-primary">Exportar Dados</h4>
                                    <p className="text-sm text-secondary">Baixe todos os seus dados em formato JSON</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={exportUserData} loading={isExporting}>
                                    Exportar
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                                <div>
                                    <h4 className="font-medium text-primary">Alterar Senha</h4>
                                    <p className="text-sm text-secondary">Atualize sua senha de acesso</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                                    Alterar
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-red-400">Excluir Conta</h4>
                                    <p className="text-sm text-red-300">Esta ação não pode ser desfeita</p>
                                </div>
                                <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Legal */}
                    <Card>
                        <h3 className="text-lg font-semibold text-primary mb-4">Legal</h3>
                        <div className="space-y-3">
                            <button
                                className="flex items-center justify-between w-full p-3 hover:bg-surface-light rounded-lg transition-colors"
                                onClick={() => setShowTermsModal(true)}
                            >
                                <span className="text-secondary">Termos de Uso</span>
                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button
                                className="flex items-center justify-between w-full p-3 hover:bg-surface-light rounded-lg transition-colors"
                                onClick={() => setShowPrivacyModal(true)}
                            >
                                <span className="text-secondary">Política de Privacidade</span>
                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button
                                className="flex items-center justify-between w-full p-3 hover:bg-surface-light rounded-lg transition-colors"
                                onClick={() => setShowLGPDModal(true)}
                            >
                                <span className="text-secondary">LGPD - Proteção de Dados</span>
                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-primary mb-4">Suas Estatísticas</h3>
                        <div className="space-y-4">
                            <div className="text-center p-4 bg-surface-light rounded-lg">
                                <div className="text-2xl font-bold text-primary">{user.stats.tasksCompleted}</div>
                                <div className="text-sm text-secondary">Tarefas Concluídas</div>
                            </div>

                            <div className="text-center p-4 bg-surface-light rounded-lg">
                                <div className="text-2xl font-bold text-green-500">{user.stats.pomodoroSessions}</div>
                                <div className="text-sm text-secondary">Sessões Pomodoro</div>
                            </div>

                            <div className="text-center p-4 bg-surface-light rounded-lg">
                                <div className="text-2xl font-bold text-blue-500">
                                    {Math.floor(user.stats.totalFocusTime / 60)}h {user.stats.totalFocusTime % 60}m
                                </div>
                                <div className="text-sm text-secondary">Tempo Focado</div>
                            </div>

                            <div className="text-center p-4 bg-surface-light rounded-lg">
                                <div className="text-2xl font-bold text-orange-500">{user.stats.streak}</div>
                                <div className="text-sm text-secondary">Sequência Atual</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Delete Account Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Excluir Conta">
                <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            <div>
                                <h4 className="font-medium text-red-400">Atenção!</h4>
                                <p className="text-sm text-red-300">Esta ação não pode ser desfeita.</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-secondary">
                        Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo:
                    </p>

                    <ul className="list-disc list-inside text-sm text-muted space-y-1">
                        <li>Todas as suas tarefas e projetos</li>
                        <li>Histórico de sessões Pomodoro</li>
                        <li>Metas e hábitos criados</li>
                        <li>Anotações e configurações</li>
                    </ul>

                    <div className="flex space-x-3 pt-4">
                        <Button variant="danger" onClick={handleDeleteAccount} loading={isLoadingDelete} className="flex-1">
                            Sim, excluir minha conta
                        </Button>

                        <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="flex-1">
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Password Change Modal */}
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Alterar Senha">
                <div className="space-y-4">
                    <Input
                        label="Senha Atual"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                    />
                    <Input
                        label="Nova Senha"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={() => setShowPasswordModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            loading={isLoadingPassword}
                            onClick={async () => {
                                setIsLoadingPassword(true)
                                try {
                                    await UserService.changePassword(passwordData)
                                    toast.success("Senha alterada com sucesso!")
                                    setShowPasswordModal(false)
                                    setPasswordData({ currentPassword: "", newPassword: "" })
                                } catch {
                                    toast.error("Erro ao alterar senha.")
                                } finally {
                                    setIsLoadingPassword(false)
                                }
                            }}
                        >
                            Salvar
                        </Button>

                    </div>
                </div>
            </Modal>

            {/* Terms of Use Modal */}
            <Modal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} title="Termos de Uso" size="lg">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm text-secondary">
                        <h3 className="text-primary font-semibold">1. Aceitação dos Termos</h3>
                        <p>
                            Ao utilizar o MyFocus, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não
                            concordar com qualquer parte destes termos, não deve usar nosso serviço.
                        </p>

                        <h3 className="text-primary font-semibold">2. Descrição do Serviço</h3>
                        <p>
                            O MyFocus é uma plataforma de produtividade que oferece ferramentas para gerenciamento de tarefas, técnica
                            Pomodoro, controle de hábitos e definição de metas pessoais.
                        </p>

                        <h3 className="text-primary font-semibold">3. Conta do Usuário</h3>
                        <p>
                            Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em aceitar a
                            responsabilidade por todas as atividades que ocorrem sob sua conta.
                        </p>

                        <h3 className="text-primary font-semibold">4. Uso Aceitável</h3>
                        <p>
                            Você concorda em usar o serviço apenas para fins legais e de acordo com estes Termos. É proibido usar o
                            serviço para qualquer atividade ilegal ou não autorizada.
                        </p>

                        <h3 className="text-primary font-semibold">5. Propriedade Intelectual</h3>
                        <p>
                            O serviço e seu conteúdo original são e permanecerão propriedade exclusiva do MyFocus. O serviço é
                            protegido por direitos autorais, marcas registradas e outras leis.
                        </p>

                        <h3 className="text-primary font-semibold">6. Limitação de Responsabilidade</h3>
                        <p>
                            Em nenhuma circunstância o MyFocus será responsável por danos indiretos, incidentais, especiais,
                            consequenciais ou punitivos resultantes do uso do serviço.
                        </p>

                        <h3 className="text-primary font-semibold">7. Modificações</h3>
                        <p>
                            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
                            imediatamente após a publicação.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-custom">
                    <Button onClick={() => setShowTermsModal(false)}>Fechar</Button>
                </div>
            </Modal>

            {/* Privacy Policy Modal */}
            <Modal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                title="Política de Privacidade"
                size="lg"
            >
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm text-secondary">
                        <h3 className="text-primary font-semibold">1. Informações que Coletamos</h3>
                        <p>
                            Coletamos informações que você nos fornece diretamente, como nome, email, dados de tarefas, metas e
                            preferências de uso da plataforma.
                        </p>

                        <h3 className="text-primary font-semibold">2. Como Usamos suas Informações</h3>
                        <p>Utilizamos suas informações para:</p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Fornecer e melhorar nossos serviços</li>
                            <li>Personalizar sua experiência</li>
                            <li>Comunicar atualizações e novidades</li>
                            <li>Garantir a segurança da plataforma</li>
                        </ul>

                        <h3 className="text-primary font-semibold">3. Compartilhamento de Informações</h3>
                        <p>
                            Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros, exceto quando necessário
                            para fornecer o serviço ou quando exigido por lei.
                        </p>

                        <h3 className="text-primary font-semibold">4. Segurança dos Dados</h3>
                        <p>
                            Implementamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não
                            autorizado, alteração, divulgação ou destruição.
                        </p>

                        <h3 className="text-primary font-semibold">5. Cookies e Tecnologias Similares</h3>
                        <p>
                            Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do serviço e
                            personalizar conteúdo.
                        </p>

                        <h3 className="text-primary font-semibold">6. Seus Direitos</h3>
                        <p>
                            Você tem o direito de acessar, atualizar, corrigir ou excluir suas informações pessoais. Entre em contato
                            conosco para exercer esses direitos.
                        </p>

                        <h3 className="text-primary font-semibold">7. Alterações na Política</h3>
                        <p>
                            Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através do
                            serviço ou por email.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-custom">
                    <Button onClick={() => setShowPrivacyModal(false)}>Fechar</Button>
                </div>
            </Modal>

            {/* LGPD Modal */}
            <Modal isOpen={showLGPDModal} onClose={() => setShowLGPDModal(false)} title="LGPD - Proteção de Dados" size="lg">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm text-secondary">
                        <h3 className="text-primary font-semibold">1. Controlador e Encarregado (DPO)</h3>
                        <p>
                            O <strong>MyFocus</strong> é o controlador dos dados pessoais tratados nesta plataforma,
                            representado por <strong>MyFocus</strong>.
                        </p>
                        <p>
                            O Encarregado de Proteção de Dados (DPO) é <strong>Guilherme Aires</strong>.
                            Para qualquer solicitação, dúvida ou exercício de direitos relacionados à proteção de dados
                            pessoais,
                            entre em contato através do e-mail: <a
                            href="mailto:myfocus.suporte@gmail.com">myfocus.suporte@gmail.com</a>.
                        </p>

                        <h3 className="text-primary font-semibold">2. Bases Legais e Finalidades</h3>
                        <p>O tratamento de dados pessoais no MyFocus ocorre com base nas seguintes hipóteses legais:</p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Execução de contrato: para viabilizar o funcionamento da plataforma e suas
                                funcionalidades.
                            </li>
                            <li>Consentimento: quando você opta por fornecer dados adicionais ou receber comunicações.
                            </li>
                            <li>Interesse legítimo: para melhoria contínua dos serviços e segurança da aplicação.</li>
                            <li>Cumprimento de obrigação legal ou regulatória.</li>
                        </ul>

                        <h3 className="text-primary font-semibold">3. Direitos do Titular</h3>
                        <p>Em conformidade com a LGPD, você possui os seguintes direitos:</p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Confirmar a existência de tratamento de dados pessoais;</li>
                            <li>Solicitar acesso, correção ou exclusão dos seus dados;</li>
                            <li>Solicitar anonimização, bloqueio ou portabilidade;</li>
                            <li>Revogar o consentimento a qualquer momento;</li>
                            <li>Solicitar informações sobre o compartilhamento de dados com terceiros.</li>
                        </ul>
                        <p>
                            O prazo de resposta às solicitações é de até <strong>15 dias</strong> corridos, conforme
                            previsto pela LGPD.
                        </p>

                        <h3 className="text-primary font-semibold">4. Retenção e Segurança dos Dados</h3>
                        <p>
                            Os dados pessoais são mantidos apenas enquanto a conta estiver ativa ou conforme exigido por
                            lei.
                            São aplicadas medidas técnicas e organizacionais adequadas para proteger suas informações
                            contra acessos não autorizados,
                            perda ou destruição.
                        </p>

                        <h3 className="text-primary font-semibold">5. Transferência Internacional</h3>
                        <p>
                            Caso haja transferência internacional de dados, garantimos que será feita apenas para países
                            com nível adequado de proteção
                            ou mediante adoção de garantias contratuais apropriadas.
                        </p>

                        <h3 className="text-primary font-semibold">6. Contato</h3>
                        <p>
                            Em caso de dúvidas ou solicitações relacionadas ao tratamento de dados pessoais,
                            envie uma mensagem para: <a
                            href="mailto:myfocus.suporte@gmail.com">myfocus.suporte@gmail.com</a>.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-custom">
                    <Button onClick={() => setShowLGPDModal(false)}>Fechar</Button>
                </div>
            </Modal>
        </div>
    )
}
