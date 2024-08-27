import { GetServerSidePropsContext } from "next";
import axios, { AxiosError } from "axios";

export function setupAPIClient(ctx?: GetServerSidePropsContext) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoicmFmYWVsIiwiZW1haWwiOiJyYWZhZWxAZ21haWwuY29tIiwiaWF0IjoxNzI0NzI0MTY2LCJleHAiOjE3MjQ4MTA1NjZ9.XDVOs64H5NJUwK0q7XwikZAckumveluSya8YTJFOP1UF";

    const api = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
            authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoicmFmYWVsIiwiZW1haWwiOiJyYWZhZWxAZ21haWwuY29tIiwiaWF0IjoxNzI0NzI0MTY2LCJleHAiOjE3MjQ4MTA1NjZ9.XDVOs64H5NJUwK0q7XwikZAckumveluSya8YTJFOP1U`
        }
    })

    // api.interceptors.response.use((response) => {
    //     return response
    // }, (error: AxiosError) => {
    //     if (error.response?.status === 401) {
    //         //Qualquer erro 401 (Não autorizado) devemos deslogar o usuário
    //         if (typeof window !== undefined) {
    //             signOut();
    //         } else {
    //             return;
    //         }
    //     }

    //     return Promise.reject(error)
    // })

    return api;
}