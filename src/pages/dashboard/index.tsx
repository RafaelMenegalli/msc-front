import { Header } from "@/components/Header"
import { useEffect } from "react"
import { api } from "@/services/apiClient"
import { canSSRAuth } from "@/utils/canSSRAuth"

export default function Dashboard() {
    return (
        <>
            <Header title="Dashboard" />
        </>
    )
}

export const getServerSideProps = canSSRAuth(async () => {
    return {
        props: {

        }
    }
})