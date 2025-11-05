import app from "./app";
// Inicia o servidor na porta especificada no arquivo .env ou na porta 4000 por padrão
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
