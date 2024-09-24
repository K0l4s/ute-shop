import internal from "stream";
// role enum
export enum Role {
    ADMIN = "ADMIN",
    USER = "CUSTOMER",
    GUEST = "GUEST",
    };
export type User = {
    firstname: string;
    lastname: string;
    address: string;
    birthday: Date;
    gender: boolean;
    avatar_url: string;
    phone: string;
    email: string;
    password: string;
    is_active: boolean;
    code: number;
    role: Role;
    };
