import {Request, Response} from "express";

const NEWS_API_URL = process.env.NEWS_API_URL ?? "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEWS_API_KEY as string;
const DEFAULT_QUERY =
    process.env.NEWS_API_DEFAULT_QUERY ??
    'produtividade OR "gestão de tempo" OR "organização pessoal" OR foco -smartphone -notebook -celular -promoção -desconto -oferta -laptop -iphone -galaxy -xiaomi';
const DEFAULT_LANGUAGE = process.env.NEWS_API_LANGUAGE ?? "pt";

const BLOCK_KEYWORDS = [
    "smartphone",
    "notebook",
    "celular",
    "promoção",
    "desconto",
    "oferta",
    "laptop",
    "iphone",
    "galaxy",
    "xiaomi",
];

export const getProductivityNews = async (req: Request, res: Response) => {
    try {
        if (!NEWS_API_KEY) {
            return res
                .status(500)
                .json({error: "NEWS_API_KEY não configurada no servidor."});
        }

        const q = (req.query.q as string) || DEFAULT_QUERY;

        const page = Number(req.query.page ?? 1);

        const rawPageSize = Number(req.query.pageSize ?? 5);
        const pageSize =
            !Number.isFinite(rawPageSize) || rawPageSize <= 0
                ? 5
                : Math.min(rawPageSize, 20);

        const externalPageSize = pageSize * 3;

        const url = new URL(NEWS_API_URL);
        url.searchParams.set("q", q);
        url.searchParams.set("language", DEFAULT_LANGUAGE);
        url.searchParams.set("apiKey", NEWS_API_KEY);
        url.searchParams.set("page", String(page));
        url.searchParams.set("pageSize", String(externalPageSize));

        const response = await fetch(url.toString());
        if (!response.ok) {
            return res
                .status(502)
                .json({error: "Falha ao acessar NewsAPI", status: response.status});
        }

        const data = await response.json();

        const rawArticles: any[] = Array.isArray(data.articles) ? data.articles : [];

        const mapped = rawArticles.map((article) => ({
            title: article.title as string | null,
            description: article.description as string | null,
            url: article.url as string | null,
            imageUrl: article.urlToImage as string | null,
            publishedAt: article.publishedAt as string | null,
            source: article.source?.name as string | null,
        }));

        const filtered = mapped.filter((article) => {
            if (!article.title || !article.url) return false;

            const t = article.title.toLowerCase();

            if (BLOCK_KEYWORDS.some((kw) => t.includes(kw))) return false;

            return true;
        });

        const limited = filtered.slice(0, pageSize);

        return res.json({
            total: data.totalResults ?? filtered.length,
            page,
            pageSize,
            articles: limited,
        });
    } catch (err) {
        console.error("Erro ao buscar notícias de produtividade:", err);
        return res.status(500).json({error: "Erro interno ao buscar notícias"});
    }
};
