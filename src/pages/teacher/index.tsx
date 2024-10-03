import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { DeleteConfirmationTeacher } from "@/components/old/DeleteConfirmationTeacher";
import { FormEvent, useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { ButtonToolbar, Button, Input, Notification, toaster, Table, Divider } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import { api } from "@/services/apiClient";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { UpdateTeacherModal } from "@/components/UpdateTeacherModal";

const { Column, HeaderCell, Cell } = Table;
const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

export type teacher = {
    id: number;
    name: string;
    email: string;
}

interface Props {
    teachersProps: teacher[]
}

export default function Teacher({ teachersProps }: Props) {
    const [teachers, setTeachers] = useState<teacher[]>(teachersProps || []);
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [tableData, setTableData] = useState<teacher[]>(teachers ? teachers : [])
    const [filterInput, setFilterInput] = useState<string>("")
    const [teacherToUpdate, setTeacherToUpdate] = useState<teacher | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (filterInput === "") {
            setTableData(teachers);
        } else {
            const filteredData = teachers.filter(teacher => {
                const lowerCaseFilter = filterInput.toLowerCase();
                return (
                    teacher.name.toLowerCase().includes(lowerCaseFilter) ||
                    teacher.email.toLowerCase().includes(lowerCaseFilter)
                );
            });
            setTableData(filteredData);
        }
    }, [filterInput, teachers]);

    const handleModalVisible = () => {
        setModalVisible(!modalVisible)
    }

    async function refreshData() {
        setLoading(true);
        try {
            const response = await api.get("/teachers");
            setTableData(response.data);
            setTeachers(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("Erro ao buscar professores :::>> ", error);

            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao buscar professores!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            );
        }
    }


    async function handleRegisterTeacher(event: FormEvent) {
        setLoading(true)

        event?.preventDefault();

        if (!name || !email) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todos os campos para cadastrar um professor!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            setLoading(false)
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
            setTeachers(response.data);
            setTableData(response.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
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
                                <Button appearance="primary" type="submit" color="green">
                                    Cadastrar
                                </Button>
                            </ButtonToolbar>
                        </div>
                    </form>

                </div>

                <Divider>Listagem de Professores</Divider>

                <div className={styles.filterContainer}>
                    <Input
                        type="text"
                        value={filterInput}
                        onChange={(e) => setFilterInput(e)}
                        placeholder="Pesquise por qualquer coisa..."
                    />
                </div>

                <div className={styles.containerTable}>
                    <Table
                        height={350}
                        data={tableData}
                        className={styles.table}
                        loading={loading}
                    >

                        <Column flexGrow={1}>
                            <HeaderCell>Nome</HeaderCell>
                            <Cell dataKey="name" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell>Email</HeaderCell>
                            <Cell dataKey="email" />
                        </Column>

                        <Column width={75} fixed="right">
                            <HeaderCell>Ações</HeaderCell>
                            <Cell>
                                {rowData => (
                                    <>
                                        <EditIcon
                                            className={styles.buttonEditIcon}
                                            onClick={() => {
                                                handleModalVisible()
                                                setTeacherToUpdate({ id: rowData.id, name: rowData.name, email: rowData.email })
                                            }}
                                        />
                                    </>
                                )}
                            </Cell>
                        </Column>

                    </Table>
                </div>
            </div>

            {modalVisible && teacherToUpdate && (
                <UpdateTeacherModal
                    teacher={teacherToUpdate}
                    setModalVisible={handleModalVisible}
                    refreshData={refreshData}
                />
            )}
        </>
    )
}

export const getServerSideProps = canSSRAuth(async () => {
    const teachers = await api.get("/teachers")

    return {
        props: {
            teachersProps: teachers.data
        }
    }

}) 