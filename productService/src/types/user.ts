export enum Role {
    Admin = 'admin',
    User = 'user',
}

export type User = {
    role: Role;
    email: string;
    phone: number;
    name: string;
    id: string;
};