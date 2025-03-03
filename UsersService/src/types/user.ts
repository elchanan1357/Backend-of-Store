export type User ={
    name: string,
    phone: number,
    email: string,
    password: string,
    role: Role 
}

export enum Role{
    Admin = 'admin',
    User = 'user'
}