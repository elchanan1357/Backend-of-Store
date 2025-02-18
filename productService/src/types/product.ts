export enum ProductCategory {
    PHONES = 'phones',
    TABLETS = 'tablets',
    LAPTOPS = 'laptops',
}

export interface Product {
    name: string;
    price: number;
    stock: number;
    description?: string;
    img?: string;
    mkt: string;
    category: ProductCategory;
}
