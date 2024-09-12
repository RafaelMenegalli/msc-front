import { GetServerSidePropsContext } from "next";
import axios, { AxiosError } from "axios";

export function setupAPIClient(ctx?: GetServerSidePropsContext) {
    const api = axios.create({
        baseURL: "https://devoted-ambition-production.up.railway.app",
        headers: {
            authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoicmFmYWVsIiwiZW1haWwiOiJyYWZhZWxAZ21haWwuY29tIiwiaWF0IjoxNzI2MDkyNjA5LCJleHAiOjE3Mjg2ODQ2MDl9.W3o0taHTCwhR0pWFtHll8DlunyfV4HZRJ8TzlM3Mw98`
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