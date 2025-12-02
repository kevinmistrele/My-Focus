import type React from "react"
import {useEffect, useState} from "react"
import {NewsService} from "../services/news.service"
import type {NewsArticle} from "../lib/types"
import {Card} from "../components/ui/Card"
import {Button} from "../components/ui/Button"

const FALLBACK_IMAGE =
    "https://via.placeholder.com/300x200.png?text=Sem+imagem"

export const NewsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 5

    const fetchNews = async (opts?: { newPage?: number }) => {
        try {
            setLoading(true)
            setError(null)

            const currentPage = opts?.newPage ?? page

            const data = await NewsService.getProductivityNews(
                undefined,
                currentPage,
                pageSize
            )

            setArticles(data.articles)
            setTotal(data.total)
            setPage(currentPage)
        } catch {
            setError("Não foi possível carregar as notícias no momento.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchNews()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Notícias</h1>
                    <p className="text-sm text-muted">
                        Atualizações sobre foco, produtividade, organização pessoal e tecnologia.
                    </p>
                </div>
            </header>

            {loading && <p className="text-muted">Carregando notícias...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!loading && !articles.length && !error && (
                <p className="text-muted text-sm">Nenhuma notícia encontrada.</p>
            )}

            <div className="space-y-3">
                {articles.map((article) => (
                    <Card key={article.url} className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-48 shrink-0">
                            <img
                                src={article.imageUrl || FALLBACK_IMAGE}
                                onError={(e) => {
                                    e.currentTarget.src = FALLBACK_IMAGE
                                }}
                                alt={article.title}
                                className="w-full h-32 object-cover rounded-md"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-secondary mb-1">
                                {article.title}
                            </h2>

                            {article.source && (
                                <p className="text-xs text-muted mb-1">Fonte: {article.source}</p>
                            )}

                            {article.publishedAt && (
                                <p className="text-xs text-muted mb-2">
                                    Publicado em{" "}
                                    {new Date(article.publishedAt).toLocaleString("pt-BR")}
                                </p>
                            )}

                            {article.description && (
                                <p className="text-sm text-text mb-2">{article.description}</p>
                            )}

                            <a
                                href={article.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                Ler matéria completa →
                            </a>
                        </div>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm text-muted">
                    <span>
                        Página {page} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={page === 1 || loading}
                            onClick={() => fetchNews({newPage: page - 1})}
                        >
                            Anterior
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={page === totalPages || loading}
                            onClick={() => fetchNews({newPage: page + 1})}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
