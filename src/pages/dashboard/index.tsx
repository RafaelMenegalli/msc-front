import { Header } from "@/components/Header"
import { useEffect } from "react"
import { api } from "@/services/apiClient"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { SideNav } from "@/components/SideNav"

export default function Dashboard() {
    return (
        <>
            {/* <Header title="Dashboard" /> */}
            {/* <SideNav /> */}
        </>
    )
}

export const getServerSideProps = canSSRAuth(async () => {
    return {
        props: {

        }
    }
})