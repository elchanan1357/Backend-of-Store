export class ProductsNotInStockError extends Error {
    mkts: string[];
    status: number;

    constructor(mkts: string[]) {
        super('Products not in stock');

        this.status = 400;
        this.mkts = mkts;
    }
}

export class ProductsNotExistError extends Error {
    mkts: string[];
    status: number;
    constructor(mkts: string[]) {
        super('Products not found');

        this.status = 404;
        this.mkts = mkts;
    }
}