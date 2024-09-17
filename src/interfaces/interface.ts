export interface IUser {
    id: number
    name: string
    login: string
    password: string
}

export interface IWords {
    id: number
    native: string
    translate: string
    user_id: number
}