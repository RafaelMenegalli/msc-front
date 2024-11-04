import { GetServerSidePropsContext } from "next";
import axios, { AxiosError } from "axios";
import { parseCookies, destroyCookie } from "nookies";
import { signOut } from "@/contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

export function setupAPIClient(ctx = undefined) {
    const cookies = parseCookies(ctx);
    const token = cookies['@mscauth.token'];

    const URLProd = "https://msc-api-production.up.railway.app";
    const URLHomolog = "https://devoted-ambition-production.up.railway.app";

    const api = axios.create({
        baseURL: URLProd,
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    api.interceptors.response.use((response) => {
        return response;
    }, (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                signOut(); // Client-side: deslogar o usuário
            } else if (ctx) {
                return Promise.reject(new AuthTokenError());
            }

        }

        return Promise.reject(error);
    });

    return api;
}
