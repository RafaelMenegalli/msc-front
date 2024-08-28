import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { DeleteConfirmationStudent } from "@/components/DeleteConfirmationStudent";
import { FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import { formatCPF } from "./utils/formatCPF";

import { Form, ButtonToolbar, Button, Input, InputGroup, Notification, toaster, Table, Divider, Placeholder } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';

import { api } from "@/services/apiClient";

const { Column, HeaderCell, Cell } = Table;
const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

type student = {
    name: string;
    email: string;
    cpf: string;
    password: string;
}

interface Props {
    students: student[]
}

export default function Student({ students }: Props) {
    const [visibleEye, setVisibleEye] = useState(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const [name, setName] = useState<string>("")
    const [cpf, setCpf] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    // const [password, setPassword] = useState<string>("")

    const handleChangeEyeInput = () => {
        setVisibleEye(!visibleEye);
    };

    const handleModalVisible = () => {
        setModalVisible(!modalVisible)
    }

    async function handleRegisterStudent(event: FormEvent) {
        event?.preventDefault();

        if (!name || !email) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todos os campos para cadastrar um aluno!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            return
        }

        try {
            await api.post("/students", {
                name: name,
                email: email,
                cpf: cpf,
                password: ""
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Aluno cadastrado com sucesso!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            setName("")
            setEmail("")
            setCpf("")
            // setPassword("")
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao cadastrar aluno!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            console.log("Erro ao cadastrar usuário :::>> ", error)
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

                            <div style={{ gridColumn: 'span 3' }}>
                                <Label>Temp</Label>
                                <Input
                                    type="nunber"
                                    value={email}
                                    onChange={e => setEmail(e)}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 3' }}>
                                <Label>Temp</Label>
                                <Input
                                    type="nunber"
                                    value={email}
                                    onChange={e => setEmail(e)}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 3' }}>
                                <Label>Temp</Label>
                                <Input
                                    type="nunber"
                                    value={email}
                                    onChange={e => setEmail(e)}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 3' }}>
                                <Label>Temp</Label>
                                <Input
                                    type="nunber"
                                    value={email}
                                    onChange={e => setEmail(e)}
                                />
                            </div>

                            {/* <Form.Group controlId="password">
                            <Form.ControlLabel>Senha</Form.ControlLabel>

                            <InputGroup inside className={styles.inputGroup}>
                                <Input
                                    type={visibleEye ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={e => setPassword(e)}
                                />
                                <InputGroup.Button onClick={handleChangeEyeInput}>
                                    {visibleEye ? <EyeIcon /> : <EyeSlashIcon />}
                                </InputGroup.Button>
                            </InputGroup>

                        </Form.Group> */}

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

                <Divider>Listagem de Alunos</Divider>

                <div className={styles.containerTable}>
                    <Table
                        autoHeight
                        data={students}
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
                <DeleteConfirmationStudent
                    open={handleModalVisible}
                    visible={modalVisible}
                />
            )}
        </>
    )
}

export const getServerSideProps = (async () => {
    const students = await api.get("/students")

    return {
        props: {
            students: students.data
        }
    }
})