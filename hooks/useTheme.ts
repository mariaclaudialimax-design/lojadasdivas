
import { useState, useEffect, useCallback } from 'react';
import { PageTemplate } from '../types/theme';

const DEFAULT_TEMPLATE: PageTemplate = {
    name: 'Default Home',
    sections: {},
    order: []
};

export function useTheme(templateKey: string = 'index') {
    const [template, setTemplate] = useState<PageTemplate>(DEFAULT_TEMPLATE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTemplate = useCallback(async () => {
        setLoading(true);
        try {
            // First try the specialized endpoint (if table existed)
            // But since we used backup strategy, let's fetch from home-sections
            const res = await fetch('/.netlify/functions/home-sections');
            const data = await res.json();

            // Find the template
            const templateRow = data.find((r: any) => r.section_key === `theme_template_${templateKey}`);

            if (templateRow && templateRow.data) {
                setTemplate(templateRow.data);
            } else {
                // Fallback attempt to theme-templates endpoint if migrated
                try {
                    const res2 = await fetch(`/.netlify/functions/theme-templates?key=${templateKey}`);
                    if (res2.ok) {
                        const data2 = await res2.json();
                        setTemplate(data2);
                    }
                } catch (e) {
                    console.warn('Theme templates table not found, staying empty.');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [templateKey]);

    const saveTemplate = useCallback(async (newTemplate: PageTemplate) => {
        try {
            const token = sessionStorage.getItem('admin_token');
            if (!token) throw new Error('Not authenticated');

            // Save to home-sections (Backup strategy persistence)
            // First get ID
            const resList = await fetch('/.netlify/functions/home-sections');
            const list = await resList.json();
            const row = list.find((r: any) => r.section_key === `theme_template_${templateKey}`);

            if (row) {
                await fetch(`/.netlify/functions/home-sections?id=${row.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        data: newTemplate
                    })
                });
            } else {
                // Creating is tricky without POST on this endpoint or raw insert helper
                // Assuming it exists because we seeded it.
                console.error("Template row not found to update.");
            }

            setTemplate(newTemplate);
        } catch (err: any) {
            console.error(err);
            throw err;
        }
    }, [templateKey]);

    useEffect(() => {
        fetchTemplate();
    }, [fetchTemplate]);

    return { template, loading, error, saveTemplate };
}
