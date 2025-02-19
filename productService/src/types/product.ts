export enum ProductCategory {
    SMARTPHONES = 'smartphones',
    TABLETS = 'tablets',
    LAPTOPS = 'laptops',
    ACCESSORIES = 'accessories'
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
