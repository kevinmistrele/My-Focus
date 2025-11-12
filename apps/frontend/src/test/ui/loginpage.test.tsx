// src/test/ui/LoginPage.test.tsx
import {beforeEach, describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {toast} from "sonner";
import {AuthService} from "../../services";
import {LoginPage} from "../../pages/LoginPage.tsx";


// Teste para pagina de Login usando os componentes
vi.mock("@/services", () => ({
    AuthService: {
        login: vi.fn(),
        register: vi.fn(),
    },
}));

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mocks leves pras subpáginas (só marcam presença)
vi.mock("@/pages/ForgotPasswordPage", () => ({
    ForgotPasswordPage: ({onBackToLogin}: any) => (
        <div data-testid="forgot-page">
            <button onClick={onBackToLogin}>Voltar</button>
            <span>Esqueci minha senha</span>
        </div>
    ),
}));
vi.mock("@/pages/ResetPasswordPage", () => ({
    ResetPasswordPage: ({token, onBackToLogin}: any) => (
        <div data-testid="reset-page">
            <span>Reset Password Token: {token}</span>
            <button onClick={onBackToLogin}>Voltar</button>
        </div>
    ),
}));


describe("LoginPage (UI)", () => {
    const onLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Reseta a URL antes de cada teste
        window.history.pushState({}, "", "/");
        // limpa token
        vi.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {
        });
    });

    it("faz login com sucesso e chama onLogin + salva token", async () => {
        (AuthService.login as any).mockResolvedValueOnce({
            user: {id: "u1", name: "Kevin", email: "k@k.com", role: "EMPLOYEE"},
            token: "jwt-123",
        });

        render(<LoginPage onLogin={onLogin}/>);

        // Preenche email e senha
        fireEvent.change(screen.getByPlaceholderText(/seu\.email@exemplo\.com/i), {target: {value: "k@k.com"}});
        fireEvent.change(screen.getByPlaceholderText(/mínimo 8 caracteres/i), {target: {value: "123456"}});

        // Submit
        fireEvent.click(screen.getByRole("button", {name: /entrar na minha conta/i}));

        await waitFor(() => {
            expect(AuthService.login).toHaveBeenCalledWith("k@k.com", "123456");
            expect(onLogin).toHaveBeenCalledWith(
                {id: "u1", name: "Kevin", email: "k@k.com", role: "EMPLOYEE"},
                "jwt-123",
            );
            expect(localStorage.setItem).toHaveBeenCalledWith("token", "jwt-123");
            expect(toast.success).toHaveBeenCalled(); // "Login realizado com sucesso!"
        });
    });

    it("troca para registro e valida erro de senhas diferentes", async () => {
        render(<LoginPage onLogin={onLogin}/>);

        // Vai para "Criar conta"
        fireEvent.click(screen.getByRole("button", {name: /criar conta/i}));

        // Preenche campos do registro
        fireEvent.change(screen.getByPlaceholderText(/como você gostaria de ser chamado\?/i), {target: {value: "Kevin"}});
        fireEvent.change(screen.getByPlaceholderText(/seu\.email@exemplo\.com/i), {target: {value: "k@k.com"}});
        fireEvent.change(screen.getByPlaceholderText(/mínimo 8 caracteres/i), {target: {value: "12345678"}});
        fireEvent.change(screen.getByPlaceholderText(/digite a senha novamente/i), {target: {value: "x123"}});

        // Submit
        fireEvent.click(screen.getByRole("button", {name: /criar minha conta/i}));

        await waitFor(() => {
            expect(AuthService.register).not.toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith("As senhas não coincidem.");
        });
    });

    it("navega para ForgotPasswordPage ao clicar no link", async () => {
        render(<LoginPage onLogin={onLogin}/>);

        fireEvent.click(screen.getByRole("button", {name: /esqueceu sua senha\?/i}));

        // Renderiza a subpágina mockada
        expect(await screen.findByTestId("forgot-page")).toBeInTheDocument();

        // volta pro login
        fireEvent.click(screen.getByText(/voltar/i));
        // Deve voltar a mostrar o form de login (botão de entrar presente)
        expect(await screen.findByRole("button", {name: /entrar na minha conta/i})).toBeInTheDocument();
    });

    it("entra direto em ResetPasswordPage quando tem ?token=abc na URL", async () => {
        window.history.pushState({}, "", "/?token=abc");

        render(<LoginPage onLogin={onLogin}/>);

        // Renderiza a subpágina mockada com o token
        const el = await screen.findByTestId("reset-page");
        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent("Token: abc");
    });

    it("mostra toast de erro quando login falha (exceção)", async () => {
        (AuthService.login as any).mockRejectedValueOnce(new Error("Credenciais inválidas"));

        render(<LoginPage onLogin={onLogin}/>);

        fireEvent.change(screen.getByPlaceholderText(/seu\.email@exemplo\.com/i), {target: {value: "k@k.com"}});
        fireEvent.change(screen.getByPlaceholderText(/mínimo 8 caracteres/i), {target: {value: "errada"}});
        fireEvent.click(screen.getByRole("button", {name: /entrar na minha conta/i}));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Credenciais inválidas");
        });
    });
});
