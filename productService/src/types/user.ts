export enum Role {
    Admin = 'admin',
    User = 'user',
}

export type User = {
    role: Role;
    email: string;
    phone: string;
    id: string;
};