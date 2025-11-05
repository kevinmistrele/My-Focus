const BASE_URL = import.meta.env.VITE_API_URL || "";

// Função genérica para fazer requisições HTTP
async function request<T = any>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
): Promise<T | null> {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customHeaders,
    };

    const config: RequestInit = {
        method,
        headers,
    };

    if (data && method !== "GET") {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Erro inesperado");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    } else {
        return null; // ou: return undefined;
    }
}

export const api = {
    get: <T = any>(endpoint: string, customHeaders?: Record<string, string>) =>
        request<T>("GET", endpoint, undefined, customHeaders),

    post: <T = any>(endpoint: string, data?: any, customHeaders?: Record<string, string>) =>
        request<T>("POST", endpoint, data, customHeaders),

    put: <T = any>(endpoint: string, data?: any, customHeaders?: Record<string, string>) =>
        request<T>("PUT", endpoint, data, customHeaders),

    delete: <T = any>(endpoint: string, data?: any, customHeaders?: Record<string, string>) =>
        request<T>("DELETE", endpoint, data, customHeaders),
};
