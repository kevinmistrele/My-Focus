import {createRoot} from "react-dom/client"
import "./styles/global.css"
import App from "./App.tsx"
import {AuthProvider} from "./contexts/AuthContext.tsx";
import {Toaster} from "sonner"

createRoot(document.getElementById("root")!).render(
        <AuthProvider>
            <App />
            <Toaster
                theme="dark"
                position="bottom-right"
                toastOptions={{
                    classNames: {
                        toast: "bg-card-bg border border-primary text-text-light rounded-2xl shadow-lg p-4",
                        title: "text-primary font-semibold",
                        description: "text-secondary text-sm",
                        actionButton: "bg-accent text-white hover:bg-accent/80 transition",
                        cancelButton: "text-error hover:underline",
                        icon: "text-primary",
                    },
                }}
            />
        </AuthProvider>
)
