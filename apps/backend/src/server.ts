import app from "./app"

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📚 Swagger docs available at http://localhost:${PORT}/docs`)
})
