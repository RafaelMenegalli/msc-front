import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { FormEvent, useState, useEffect } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { ButtonToolbar, Button, Input, Notification, toaster, Table, Divider, Placeholder, InputGroup } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import EditIcon from '@rsuite/icons/Edit';
import { api } from "@/services/apiClient";
import axios from "axios";
import { setupAPIClient } from "@/services/api";

const { Column, HeaderCell, Cell } = Table;
const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

type User = {
    name: string;
    email: string;
}

interface UsersProps {
    usersProps: User[]
}

export default function Users({ usersProps }: UsersProps) {
    const [users, setUsers] = useState<User[]>(usersProps ? usersProps : [])
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [userList, setUserList] = useState<User[]>(users)
    const [filterInput, setFilterInput] = useState<string>("")

    useEffect(() => {
        if (filterInput === "") {
            setUserList(users);
        } else {
            const filteredData = users.filter(user => {
                const lowerCaseFilter = filterInput.toLowerCase();
                return (
                    user.name.toLowerCase().includes(lowerCaseFilter) ||
                    user.email.toLowerCase().includes(lowerCaseFilter)
                );
            });
            setUserList(filteredData);
        }
    }, [filterInput, users]);

    const handleChange = () => {
        setVisible(!visible);
    };

    async function handleRegisterUser(event: FormEvent) {
        event.preventDefault()

        if (!name || !email || !password) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todos os dados para cadastrar um usuário!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            return
        }

        try {
            await api.post("/users", {
                name: name,
                email: email,
                password: password
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Usuário cadastrado com sucesso!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            setName("")
            setEmail("")
            setPassword("")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toaster.push(
                    <Notification type="error" header="Erro!">
                        {error?.response?.data.message[0]}
                    </Notification>, { placement: "bottomEnd", duration: 3500 }
                )

                console.log("Erro ao cadastrar usuário :::>> ", error)
            }
        }

        try {
            const response = await api.get("/users")
            setUserList(response.data)
            setUsers(response.data)
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao buscar usuários
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            console.log("Erro ao buscar usuários :::>> ", error)
        }
    }

    return (
        <>
            <Head>
                <title>Cadastro - Usuários</title>
            </Head>
            {/* <Header title="Cadastro de Usuários" /> */}
            <div className={styles.container}>
                <div className={styles.containerForm}>
                    <form className={styles.form} onSubmit={handleRegisterUser}>
                        <div className={styles.formFields}>
                            <div style={{ gridColumn: 'span 4' }}>
                                <Label>Nome</Label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e)}
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
                                <Label>Senha</Label>
                                <InputGroup inside>
                                    <Input
                                        type={visible ? 'text' : 'password'}
                                        placeholder="Digite sua senha..."
                                        value={password}
                                        onChange={(value) => setPassword(value)}
                                    />
                                    <InputGroup.Button onClick={handleChange}>
                                        {visible ? <EyeIcon /> : <EyeSlashIcon />}
                                    </InputGroup.Button>
                                </InputGroup>
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

                <Divider>Listagem de Usuários</Divider>

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
                        data={userList}
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

                        {/* <Column width={75} fixed="right">
                            <HeaderCell>Ações</HeaderCell>
                            <Cell>
                                {rowData => (
                                    <>
                                        <EditIcon
                                            className={styles.buttonEditIcon}
                                            onClick={() => {
                                                alert("Você está editando o usuário: " + rowData.name)
                                            }}
                                        />
                                    </>
                                )}
                            </Cell>
                        </Column> */}
                    </Table>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const users = await apiClient.get("/users")

    return {
        props: {
            usersProps: users ? users.data : []
        }
    }
})