import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import Head from "next/head";
import { LaunchPresenceModal } from "@/components/LaunchPresenceModal";

import { Form, ButtonToolbar, Button, Input, InputGroup, Notification, toaster, Table, Text } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';

import { faker } from "@faker-js/faker";

const { Column, HeaderCell, Cell } = Table;

function generateFakeUsers(count: number) {
    return Array.from({ length: count }, () => ({
        initialDate: faker.date.anytime().toLocaleString(),
        student: faker.person.firstName(),
        teacher: faker.person.firstName(),
        finalDate: faker.date.anytime().toLocaleString()
    }));
}

interface FakeDataProps {
    initialDate: string;
    student: string;
    teacher: string;
    finalDate: string;
}

export default function Presences() {
    const [data, setData] = useState<FakeDataProps[]>([])
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

    useEffect(() => {
        const fakeData = generateFakeUsers(20)
        setData(fakeData)
    }, [])

    return (
        <>
            <Head>
                <title>Controle de Aulas</title>
            </Head>

            <Header />

            <div className={styles.container}>

                <h1 className={styles.title}>Controle de Presença</h1>

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
                />
            )}
        </>
    )
}