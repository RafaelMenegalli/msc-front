import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { DeleteConfirmationTeacher } from "@/components/DeleteConfirmationTeacher";
import { FormEvent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";

import { Form, ButtonToolbar, Button, Input, InputGroup, Notification, toaster, Table, Divider } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';

import { api } from "@/services/apiClient";

const { Column, HeaderCell, Cell } = Table;
const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

export type teacher = {
    id: string;
    name: string;
    email: string;
}

interface Props {
    teachers: teacher[]
}

export default function Teacher({ teachers }: Props) {
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [tableData, setTableData] = useState<teacher[]>(teachers ? teachers : [])

    const handleModalVisible = () => {
        setModalVisible(!modalVisible)
    }

    async function handleRegisterTeacher(event: FormEvent) {
        event?.preventDefault();

        if (!name || !email) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todos os campos para cadastrar um professor!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            return
        }

        try {
            await api.post("/teachers", {
                name: name,
                email: email
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Professor cadastrado com sucesso!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            setName("")
            setEmail("")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toaster.push(
                    <Notification type="error" header="Erro!">
                        {error.response?.data.message}
                    </Notification>, { placement: "bottomEnd", duration: 3500 }
                )
            }
        }

        try {
            const response = await api.get("/teachers")
            setTableData(response.data)
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao buscar professores!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            console.log("Erro ao buscar professores :::>> ", error)
        }

    }

    return (
        <>
            <Head>
                <title>Cadastro - Professor</title>
            </Head>

            <Header title="Cadastro de Professor" />

            <div className={styles.container}>
                <div className={styles.containerForm}>
                    <form className={styles.form} onSubmit={handleRegisterTeacher}>
                        <div className={styles.formFields}>
                            <div style={{ gridColumn: 'span 6' }}>
                                <Label>Nome</Label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e)}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 6' }}>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e)}
                                />
                            </div>
                        </div>

                        <div className={styles.containerButton}>
                            <ButtonToolbar>
                                <Button appearance="primary" type="submit">
                                    Cadastrar
                                </Button>
                            </ButtonToolbar>
                        </div>
                    </form>

                </div>

                <Divider>Listagem de Professores</Divider>

                <div className={styles.containerTable}>
                    <Table
                        height={400}
                        data={tableData}
                        className={styles.table}
                    >

                        <Column flexGrow={1}>
                            <HeaderCell>Nome</HeaderCell>
                            <Cell dataKey="name" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell>Email</HeaderCell>
                            <Cell dataKey="email" />
                        </Column>

                        <Column width={100} fixed="right">
                            <HeaderCell>Ações</HeaderCell>
                            <Cell>
                                {rowData => (
                                    <>
                                        <Button className={styles.trashIcon} onClick={() => handleModalVisible()}><TrashIcon /></Button>
                                        <Button className={styles.editIcon} onClick={() => alert(rowData.firstName)}><EditIcon /></Button>
                                    </>
                                )}
                            </Cell>

                        </Column>

                    </Table>
                </div>
            </div>

            {modalVisible && (
                <DeleteConfirmationTeacher
                    open={handleModalVisible}
                    visible={modalVisible}
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