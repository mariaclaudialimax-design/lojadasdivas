
import HeroBanner, { heroBannerSchema } from './HeroBanner';
import ProductGridSection, { productGridSchema } from './ProductGridSection';
import RichTextSection, { richTextSchema } from './RichTextSection';
import { SectionSchema } from '../../types/theme';

export const SECTION_LIBRARY: Record<string, { component: React.FC<any>, schema: SectionSchema }> = {
    'hero_banner': {
        component: HeroBanner,
        schema: heroBannerSchema
    },
    'product_grid': {
        component: ProductGridSection,
        schema: productGridSchema
    },
    'rich_text': {
        component: RichTextSection,
        schema: richTextSchema
    }
    // Adicionar mais seções aqui
};

export const AVAILABLE_SECTIONS = Object.entries(SECTION_LIBRARY).map(([type, def]) => ({
    type,
    name: def.schema.name,
    schema: def.schema
}));
