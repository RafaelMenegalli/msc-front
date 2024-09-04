import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import Head from "next/head";
import { LaunchPresenceModal } from "@/components/LaunchPresenceModal";
import { GetServerSideProps } from "next";
import { Button, Notification, toaster, Table, Text } from 'rsuite';
import { api } from "@/services/apiClient";
import { teacher } from "../teacher";

const { Column, HeaderCell, Cell } = Table;

interface PresencesProps {
    teachers: teacher[]
}

export default function Presences({ teachers }: PresencesProps) {
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const handleModalVisible = () => {
        setModalVisible(!modalVisible)
    }

    async function handleRegisterPresence() {
        toaster.push(
            <Notification type="success" header="Sucesso!">
                Prenseça registrada com sucesso!
            </Notification>, { placement: "bottomEnd", duration: 3500 }
        )

        setModalVisible(false)
    }

    return (
        <>
            <Head>
                <title>Controle de Aulas</title>
            </Head>

            <Header title="Lançamento de Presença" />

            <div className={styles.container}>
                <div className={styles.containerButton}>
                    <Button appearance="primary" color="cyan" size="lg" className={styles.presenceButton} onClick={handleModalVisible}>Lançar Presença</Button>
                </div>

                <div className={styles.containerText}>
                    <Text>Presença para o aluno: <strong className={styles.evidenceText}>Eduardo Moia</strong> foi registrada - 23/08/2024 18:30</Text>
                </div>
            </div>

            {modalVisible && (
                <LaunchPresenceModal
                    open={handleModalVisible}
                    visible={modalVisible}
                    registerPresence={handleRegisterPresence}
                    teachers={teachers}
                />
            )}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = (async () => {
    const teachers = await api.get("/teachers")

    return {
        props: {
            teachers: teachers.data
        }
    }
})