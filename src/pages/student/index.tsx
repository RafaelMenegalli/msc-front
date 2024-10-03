import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { DeleteConfirmationStudent } from "@/components/old/DeleteConfirmationStudent";
import { FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import { formatCPF } from "../../utils/formatCPF";
import { ButtonToolbar, Button, Input, Notification, toaster, Table, Divider, Placeholder } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import { api } from "@/services/apiClient";
import axios from "axios";
import { canSSRAuth } from "@/utils/canSSRAuth";

const { Column, HeaderCell, Cell } = Table;
const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

export type student = {
    id: number;
    name: string;
    email: string;
    cpf: string;
    rm: string;
}

interface Props {
    students: student[]
}

export default function Student({ students }: Props) {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [cpf, setCpf] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [tableData, setTableData] = useState<student[]>(students ? students : [])
    const [filterInput, setFilterInput] = useState<string>("")

    useEffect(() => {
        if (filterInput === "") {
            setTableData(students);
        } else {
            const filteredData = students.filter(student => {
                const lowerCaseFilter = filterInput.toLowerCase();
                return (
                    student.name.toLowerCase().includes(lowerCaseFilter) ||
                    student.email.toLowerCase().includes(lowerCaseFilter) ||
                    student.cpf.includes(lowerCaseFilter) ||
                    student.rm.includes(lowerCaseFilter)
                );
            });
            setTableData(filteredData);
        }
    }, [filterInput, students]);

    const handleModalVisible = () => {
        setModalVisible(!modalVisible)
    }

    async function handleRegisterStudent(event: FormEvent) {
        event?.preventDefault();

        if (!name || !email || !cpf) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todos os campos para cadastrar um aluno!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            return
        }

        try {
            const formattedCPF = cpf.replace(/\D/g, '')

            await api.post("/students", {
                name: name,
                email: email,
                cpf: formattedCPF
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Aluno cadastrado com sucesso!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            setName("")
            setEmail("")
            setCpf("")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toaster.push(
                    <Notification type="error" header="Erro!">
                        {error?.response?.data.message[0]}
                    </Notification>, { placement: "bottomEnd", duration: 3500 }
                )

                console.log("Erro ao cadastrar Aluno :::>> ", error)
            }
        }

        try {
            const response = await api.get("/students")
            setTableData(response.data)
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao buscar alunos!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            console.log("Erro ao buscar Aluno :::>> ", error)
        }

    }

    return (
        <>
            <Head>
                <title>Cadastro - Aluno</title>
            </Head>
            <Header title="Cadastro de Aluno" />
            <div className={styles.container}>
                <div className={styles.containerForm}>
                    <form className={styles.form} onSubmit={handleRegisterStudent}>
                        <div className={styles.formFields}>
                            <div style={{ gridColumn: 'span 4' }}>
                                <Label>Nome</Label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e)}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 3' }}>
                                <Label>CPF</Label>
                                <Input
                                    type="text"
                                    value={cpf}
                                    maxLength={14}
                                    onChange={e => {
                                        const formattedCpf = formatCPF(e);
                                        setCpf(formattedCpf);
                                    }}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 5' }}>
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

                <Divider>Listagem de Alunos</Divider>

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
                    >

                        <Column flexGrow={1}>
                            <HeaderCell>Nome</HeaderCell>
                            <Cell dataKey="name" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell>CPF</HeaderCell>
                            <Cell dataKey="cpf" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell>Email</HeaderCell>
                            <Cell dataKey="email" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell>Código ( RM )</HeaderCell>
                            <Cell dataKey="rm" />
                        </Column>

                        <Column width={75} fixed="right">
                            <HeaderCell>Ações</HeaderCell>
                            <Cell>
                                {rowData => (
                                    <>
                                        <EditIcon
                                            className={styles.buttonEditIcon}
                                            onClick={() => {
                                                alert("Você está editando o aluno: " + rowData.name)
                                            }}
                                        />
                                    </>
                                )}
                            </Cell>
                        </Column>
                    </Table>
                </div>
            </div>

            {modalVisible && (
                <DeleteConfirmationStudent
                    open={handleModalVisible}
                    visible={modalVisible}
                />
            )}
        </>
    )
}

export const getServerSideProps = canSSRAuth(async () => {
    const students = await api.get("/students")

    return {
        props: {
            students: students.data
        }
    }
})  