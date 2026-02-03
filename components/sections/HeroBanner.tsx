
import React from 'react';
import { SectionSchema, SectionProps } from '../../types/theme';
import { ArrowRight } from 'lucide-react';

const HeroBanner: React.FC<SectionProps> = ({ settings, blocks }) => {
    const {
        image_desktop,
        image_mobile,
        title,
        subtitle,
        text_color,
        text_align,
        button_text,
        button_link,
        overlay_opacity,
        height_desktop,
        height_mobile
    } = settings;

    const style = {
        color: text_color || '#ffffff',
        textAlign: (text_align as any) || 'center',
    };

    const overlayBg = `rgba(0,0,0, ${(overlay_opacity || 20) / 100})`;

    return (
        <section className="relative w-full overflow-hidden group">
            {/* Background Images */}
            <div className={`relative w-full ${height_mobile || 'h-[400px]'} md:${height_desktop || 'md:h-[600px]'}`}>
                {image_mobile && (
                    <img
                        src={image_mobile}
                        alt={title}
                        className="w-full h-full object-cover md:hidden"
                    />
                )}
                {image_desktop ? (
                    <img
                        src={image_desktop}
                        alt={title}
                        className={`w-full h-full object-cover ${image_mobile ? 'hidden md:block' : ''}`}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        Placeholder Image
                    </div>
                )}

                {/* Overlay */}
                <div
                    className="absolute inset-0 transition-colors duration-300"
                    style={{ backgroundColor: overlayBg }}
                />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="container mx-auto px-4">
                    <div
                        className={`max-w-xl ${text_align === 'left' ? 'mr-auto' : text_align === 'right' ? 'ml-auto' : 'mx-auto'}`}
                        style={style}
                    >
                        {title && (
                            <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight">
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p className="text-lg md:text-xl md:mb-8 mb-6 opacity-90 font-light">
                                {subtitle}
                            </p>
                        )}

                        {button_text && (
                            <a
                                href={button_link || '#'}
                                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors transform hover:scale-105 duration-200"
                            >
                                {button_text} <ArrowRight size={18} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export const heroBannerSchema: SectionSchema = {
    name: "Hero Banner",
    settings: [
        {
            id: "image_desktop",
            type: "image",
            label: "Imagem Desktop (1920x800)",
        },
        {
            id: "image_mobile",
            type: "image",
            label: "Imagem Mobile (800x1200)",
        },
        {
            id: "height_desktop",
            type: "select",
            label: "Altura Desktop",
            default: "md:h-[600px]",
            options: [
                { value: "md:h-[400px]", label: "Pequeno (400px)" },
                { value: "md:h-[600px]", label: "Médio (600px)" },
                { value: "md:h-[800px]", label: "Grande (800px)" },
                { value: "md:h-screen", label: "Tela Cheia" }
            ]
        },
        {
            id: "height_mobile",
            type: "select",
            label: "Altura Mobile",
            default: "h-[400px]",
            options: [
                { value: "h-[300px]", label: "Pequeno (300px)" },
                { value: "h-[400px]", label: "Médio (400px)" },
                { value: "h-[500px]", label: "Grande (500px)" },
                { value: "h-[80vh]", label: "Tela Quase Cheia" }
            ]
        },
        {
            id: "overlay_opacity",
            type: "range",
            label: "Opacidade do Overlay (%)",
            min: 0,
            max: 90,
            step: 5,
            default: 20
        },
        {
            id: "title",
            type: "text",
            label: "Título Principal",
            default: "Nova Coleção"
        },
        {
            id: "subtitle",
            type: "textarea",
            label: "Subtítulo",
            default: "Confira as novidades da estação."
        },
        {
            id: "text_align",
            type: "select",
            label: "Alinhamento do Texto",
            default: "center",
            options: [
                { value: "left", label: "Esquerda" },
                { value: "center", label: "Centro" },
                { value: "right", label: "Direita" }
            ]
        },
        {
            id: "text_color",
            type: "color",
            label: "Cor do Texto",
            default: "#ffffff"
        },
        {
            id: "button_text",
            type: "text",
            label: "Texto do Botão",
            default: "Comprar Agora"
        },
        {
            id: "button_link",
            type: "url",
            label: "Link do Botão"
        }
    ]
};

export default HeroBanner;
