import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import Head from "next/head";
import { LaunchPresenceModal } from "@/components/LaunchPresenceModal";

import { Form, ButtonToolbar, Button, Input, InputGroup, Notification, toaster, Table } from 'rsuite';
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

                <div className={styles.containerTable}>
                    <Table
                        height={400}
                        data={data}
                        className={styles.table}
                    >

                        <Column width={300}>
                            <HeaderCell>Aluno</HeaderCell>
                            <Cell dataKey="student" />
                        </Column>

                        <Column width={300}>
                            <HeaderCell>Professor</HeaderCell>
                            <Cell dataKey="teacher" />
                        </Column>

                        <Column width={300}>
                            <HeaderCell>Horário de Início</HeaderCell>
                            <Cell dataKey="initialDate" />
                        </Column>

                        <Column width={250}>
                            <HeaderCell>Horário de Fim</HeaderCell>
                            <Cell dataKey="finalDate" />
                        </Column>

                        <Column width={100} fixed="right">
                            <HeaderCell>Ações</HeaderCell>
                            <Cell>
                                {rowData => (
                                    <>
                                        <Button className={styles.trashIcon} onClick={() => handleModalVisible()}><TrashIcon /></Button>
                                        <Button className={styles.editIcon} onClick={() => alert(rowData.student)}><EditIcon /></Button>
                                    </>
                                )}
                            </Cell>

                        </Column>

                    </Table>
                </div>
            </div>

            {modalVisible && (
                <LaunchPresenceModal 
                    open={handleModalVisible}
                    visible={modalVisible}
                />
            )}
        </>
    )
}