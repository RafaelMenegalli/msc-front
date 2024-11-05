import { Header } from "@/components/Header";
import styles from "./styles.module.scss";
import { canSSRAuth } from "@/utils/canSSRAuth";

export default function AccountReceivable() {
    return (
        <>
            <Header title="Contas a Receber" />

        </>
    )
}

export const getServerSideProps = canSSRAuth(async () => {
    return {
        props: {

        }
    }
})