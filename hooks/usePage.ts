
import { useState, useEffect } from 'react';

export interface PageData {
    id: string;
    slug: string;
    title: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
}

export const usePage = (slug: string) => {
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/.netlify/functions/pages?slug=${slug}`);
                if (!response.ok) {
                    if (response.status === 404) return;
                    throw new Error('Failed to fetch page');
                }
                const data = await response.json();
                setPage(data);
            } catch (err: any) {
                console.error('Page fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPage();
    }, [slug]);

    return { page, loading, error };
};
