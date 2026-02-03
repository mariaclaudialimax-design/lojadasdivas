
import { ReactNode } from 'react';

// Tipos de Input suportados no Schema
export type SchemaInputType =
    | 'text'
    | 'textarea'
    | 'image'
    | 'color'
    | 'select'
    | 'number'
    | 'range'
    | 'checkbox'
    | 'url'
    | 'product'
    | 'collection'
    | 'richtext';

export interface SchemaSetting {
    id: string; // id da chave no JSON de settings
    type: SchemaInputType;
    label: string;
    default?: any;
    options?: { value: string; label: string }[]; // Para selects
    min?: number;
    max?: number;
    step?: number;
    info?: string; // Tooltip ou help text
}

export interface SchemaBlock {
    type: string;
    name: string;
    limit?: number;
    settings: SchemaSetting[];
}

export interface SectionSchema {
    name: string;
    class?: string; // CSS class wrapper opcional
    settings: SchemaSetting[];
    blocks?: SchemaBlock[];
    presets?: { // Configurações padrão para adicionar rápido
        name: string;
        settings?: Record<string, any>;
        blocks?: { type: string; settings?: Record<string, any> }[];
    }[];
}

// Representa uma seção instanciada no template
export interface SectionInstance {
    id: string;
    type: string;
    settings: Record<string, any>;
    blocks: BlockInstance[];
    disabled?: boolean;
}

// Representa um bloco instanciado dentro de uma seção
export interface BlockInstance {
    id: string;
    type: string;
    settings: Record<string, any>;
}

// O JSON completo de um template (ex: home.json)
export interface PageTemplate {
    name: string; // ex: 'Home Page'
    sections: Record<string, SectionInstance>; // Mapa de IDs para Seções (Shopify usa isso) ou Array ordenado?
    // Shopify usa um objeto sections e uma array order. Vamos simplificar para Array por enquanto ou seguir o padrão.
    // Vamos usar Array para facilitar o Drag & Drop no React por enquanto.
    order: string[]; // Array de IDs das seções na ordem
}

export interface SectionProps {
    settings: Record<string, any>;
    blocks?: BlockInstance[];
    isPreview?: boolean; // Se está no editor
}
