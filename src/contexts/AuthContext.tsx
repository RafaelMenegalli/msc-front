import { ReactNode, createContext, useState, useEffect } from "react";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "@/services/apiClient";
import { Notification, toaster } from "rsuite";

type AuthContextData = {
    user?: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type AuthProviderProps = {
    children: ReactNode
}

type UserProps = {
    token: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@mscauth.token')
        Router.push("/")
    } catch (error) {
        console.log("Erro ao deslogar usuário :::>> ", error)
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    // useEffect(() => {
    //     const { '@mscauth.token': token } = parseCookies()

    //     if (token) {
    //         api.get("/me")
    //             .then(response => {
    //                 const { id, name, email } = response.data;

    //                 setUser({
    //                     id, name, email
    //                 })
    //             }).catch(() => {
    //                 signOut()
    //             })
    //     }
    // }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post("/auth/login", {
                email: email,
                password: password
            })

            console.log({ response })

            const { access_token: token } = response.data

            setCookie(undefined, '@mscauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })

            setUser({
                token
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Logado com sucesso!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )

            Router.push("/dashboard")
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao fazer login!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )
            console.log("Erro ao acessar :::>> ", error)
        }

    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post("/users", {
                name,
                email,
                password
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Usuário cadastrado com sucesso!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            Router.push("/")
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao cadastrar usuário!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )
            console.log("Erro ao cadastrar ususário ::::>> ", error)
        }

    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}