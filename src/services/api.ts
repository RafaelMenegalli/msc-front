import { GetServerSidePropsContext } from "next";
import axios, { AxiosError } from "axios";
import { parseCookies, destroyCookie } from "nookies";
import { signOut } from "@/contexts/AuthContext";

export function setupAPIClient(ctx?: GetServerSidePropsContext) {
    const cookies = parseCookies(ctx);
    const token = cookies['@mscauth.token'];

    const URLProd = "https://msc-api-production.up.railway.app";
    const URLHomolog = "https://devoted-ambition-production.up.railway.app";

    const api = axios.create({
        baseURL: URLHomolog,
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    api.interceptors.response.use((response) => {
        return response;
    }, (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                // Caso o código esteja rodando no client-side
                signOut(); // Desloga o usuário
            } else if (ctx) {
                // Caso o código esteja rodando no server-side (SSR)
                destroyCookie(ctx, '@mscauth.token'); // Limpa o cookie com o token inválido
                ctx.res.writeHead(302, { Location: "/" }); // Redireciona para a página de login
                ctx.res.end();
            }
        }

        return Promise.reject(error);
    });

    return api;
}
