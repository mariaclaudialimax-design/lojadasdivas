
import React from 'react';
import { SectionSchema, SectionProps } from '../../types/theme';

const RichTextSection: React.FC<SectionProps> = ({ settings }) => {
    const {
        title,
        content,
        align,
        bg_color,
        text_color,
        width
    } = settings;

    const containerWidth = width === 'narrow' ? 'max-w-3xl' : 'max-w-7xl';

    return (
        <section
            className="py-16 px-4"
            style={{ backgroundColor: bg_color || '#ffffff', color: text_color || '#111827' }}
        >
            <div className={`${containerWidth} mx-auto text-${align || 'center'}`}>
                {title && (
                    <h2 className="text-3xl font-bold mb-6 font-serif">{title}</h2>
                )}
                <div
                    className="prose prose-lg mx-auto"
                    style={{ color: text_color || '#374151' }}
                    dangerouslySetInnerHTML={{ __html: content || '' }}
                />
            </div>
        </section>
    );
};

export const richTextSchema: SectionSchema = {
    name: "Rich Text",
    settings: [
        {
            id: "title",
            type: "text",
            label: "Título",
            default: "Conte sua história"
        },
        {
            id: "content",
            type: "richtext", // No editor real isso usaria um editor HTML
            label: "Conteúdo",
            default: "<p>Compartilhe informações sobre sua marca com seus clientes.</p>"
        },
        {
            id: "align",
            type: "select",
            label: "Alinhamento",
            default: "center",
            options: [
                { value: "left", label: "Esquerda" },
                { value: "center", label: "Centro" },
                { value: "right", label: "Direita" }
            ]
        },
        {
            id: "width",
            type: "select",
            label: "Largura do Container",
            default: "narrow",
            options: [
                { value: "narrow", label: "Estreito (Leitura)" },
                { value: "wide", label: "Largo" }
            ]
        },
        {
            id: "bg_color",
            type: "color",
            label: "Cor de Fundo",
            default: "#ffffff"
        },
        {
            id: "text_color",
            type: "color",
            label: "Cor do Texto",
            default: "#111827"
        }
    ]
};

export default RichTextSection;
