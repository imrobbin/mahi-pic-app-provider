export interface LoginOptions {
    username: string;
    email: string;
    password: string;
}

export interface SignUpOptions {
    username: string;
    email: string;
    password1: string;
    password2: string;
    is_photographer: boolean;
}

export interface UserOptions {
    pk?: number;
    username: string;
    email?: string;
    first_name: string;
    last_name: string;
}

export interface ProfileOptions {
    id?: number;
    user?: string;
    pic_code?: string;
    avatar?: string;
    bio: string;
}

export interface MyPhoto {
    filepath: string;
    webviewPath: string;
    base64?: string;
    format: string;
}

export interface PasswordOptions {
    old_password: string;
    new_password1: string;
    new_password2: string;
}
