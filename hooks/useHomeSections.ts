
import { useState, useEffect } from 'react';

export interface HomeSection {
    id: string;
    section_key: string;
    section_type: 'banner' | 'grid' | 'text' | 'html';
    title: string;
    description?: string;
    data: any;
    order_position: number;
}

export const useHomeSections = () => {
    const [sections, setSections] = useState<HomeSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                setLoading(true);
                const response = await fetch('/.netlify/functions/home-sections');
                if (!response.ok) throw new Error('Failed to fetch home sections');
                const data = await response.json();
                setSections(data);
            } catch (err: any) {
                console.error('Home sections error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    return { sections, loading, error };
};
