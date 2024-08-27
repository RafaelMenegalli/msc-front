import { Header } from "@/components/Header"
import { useEffect } from "react"
import { api } from "@/services/apiClient"

export default function Dashboard() {

    useEffect(() => {
        async function fetchAPI() {

            try {
                const response = await api.get("/teachers")
    
                console.log({ response })
            } catch (error) {
                console.log(error)
            }
        }

        fetchAPI()
    }, [])

    return (
        <>
            <Header />
            <h1>Dashboard!</h1>
        </>
    )
}