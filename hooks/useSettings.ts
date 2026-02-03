
import { useState, useCallback, useEffect } from 'react';

export interface SiteSettings {
    contact_email: string;
    contact_phone: string;
    address: string;
    working_hours: string;
    footer_about: string;
    copyright: string;
    cnpj: string;
    [key: string]: string;
}

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            // We reuse the home-sections endpoint but filter by key 'global_settings' client-side 
            // or fetch all active sections and find it. 
            // Better: Fetch all sections (since they are few) and find the settings one.
            const res = await fetch('/.netlify/functions/home-sections');
            if (!res.ok) throw new Error('Failed to fetch settings');

            const sections = await res.json();
            const settingsSection = sections.find((s: any) => s.section_key === 'global_settings');

            if (settingsSection && settingsSection.data) {
                setSettings(settingsSection.data);
                return settingsSection.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = useCallback(async (newSettings: SiteSettings) => {
        try {
            const token = sessionStorage.getItem('admin_token');
            if (!token) throw new Error('Not authenticated');

            // First get the ID of the section
            const resGet = await fetch('/.netlify/functions/home-sections');
            const sections = await resGet.json();
            const settingsSection = sections.find((s: any) => s.section_key === 'global_settings');

            if (!settingsSection) throw new Error('Settings section not found');

            const res = await fetch(`/.netlify/functions/home-sections?id=${settingsSection.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    data: newSettings
                })
            });

            if (!res.ok) throw new Error('Failed to update settings');
            const updated = await res.json();
            setSettings(updated.data); // Assuming function returns parsed data in .data
        } catch (err: any) {
            console.error(err);
            throw err;
        }
    }, []);

    // Load on mount
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return { settings, loading, error, updateSettings };
}
