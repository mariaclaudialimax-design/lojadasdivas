
import React from 'react';
import { SECTION_LIBRARY } from '../components/sections';
import { PageTemplate, SectionInstance } from '../types/theme';

interface ThemeRendererProps {
    template: PageTemplate;
    isPreview?: boolean;
}

const ThemeRenderer: React.FC<ThemeRendererProps> = ({ template, isPreview = false }) => {
    if (!template || !template.order) {
        return <div>Template vazio ou inválido</div>;
    }

    return (
        <main className="min-h-screen bg-white">
            {template.order.map((sectionId) => {
                const section = template.sections[sectionId];
                if (!section) return null;

                const SectionDef = SECTION_LIBRARY[section.type];

                if (!SectionDef) {
                    if (process.env.NODE_ENV === 'development') {
                        return <div key={sectionId} className="p-4 bg-red-100 text-red-700">Seção desconhecida: {section.type}</div>;
                    }
                    return null;
                }

                const Component = SectionDef.component;

                return (
                    <div id={`section-${sectionId}`} key={sectionId} className={isPreview ? 'hover:outline hover:outline-2 hover:outline-blue-500 relative cursor-pointer' : ''}>
                        {isPreview && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 z-10 opacity-0 hover:opacity-100 pointer-events-none">
                                {SectionDef.schema.name}
                            </div>
                        )}
                        <Component
                            settings={section.settings}
                            blocks={section.blocks}
                            isPreview={isPreview}
                        />
                    </div>
                );
            })}
        </main>
    );
};

export default ThemeRenderer;
