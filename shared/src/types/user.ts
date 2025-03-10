export enum Role {
    Admin = 'admin',
    User = 'user',
}

export interface UserPayload {
    role: Role;
    email: string;
    phone: string;
    id: string;
    name?: string;
    password?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}