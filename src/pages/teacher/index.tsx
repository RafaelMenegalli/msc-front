import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { DeleteConfirmationTeacher } from "@/components/DeleteConfirmationTeacher";
import { useEffect, useState } from "react";
import Head from "next/head";

import { Form, ButtonToolbar, Button, Input, InputGroup, Notification, toaster, Table } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';

import { faker } from "@faker-js/faker";

const { Column, HeaderCell, Cell } = Table;

function generateFakeUsers(count: number) {
    return Array.from({ length: count }, () => ({
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        test: faker.internet.ip()
    }));
}

interface FakeDataProps {
    firstName: string;
    email: string;
    password: string;
    test: string
}


export default function Teacher() {
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [data, setData] = useState<FakeDataProps[]>([])
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const handleChange = () => {
        setVisible(!visible);
    };

    const handleModalVisible = () => {
        setModalVisible(!modalVisible)
    }

    useEffect(() => {
        const fakeData = generateFakeUsers(10)
        setData(fakeData)
    }, [])

    async function handleRegisterTeacher(formValue: Record<string, any> | null, event: React.FormEvent<HTMLFormElement> | undefined) {
        event?.preventDefault();

        if (!name || !email) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todos os campos para cadastrar um professor!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            return
        }

        //Função para cadastro de professor

        try {

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Professor cadastrado com sucesso!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            setName("")
            setEmail("")
        } catch (error) {

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
                    <Form className={styles.form} onSubmit={handleRegisterTeacher}>

                        <Form.Group controlId="name">
                            <Form.ControlLabel>Nome</Form.ControlLabel>
                            <Form.Control
                                name="name"
                                value={name}
                                onChange={e => setName(e)}
                            />

                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control
                                name="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e)}
                            />

                        </Form.Group>

                        <Form.Group>
                            <ButtonToolbar>
                                <Button appearance="primary" type="submit">
                                    Cadastrar
                                </Button>
                            </ButtonToolbar>
                        </Form.Group>

                    </Form>

                </div>

                <div className={styles.containerTable}>
                    <Table
                        height={400}
                        data={data}
                        className={styles.table}
                    >

                        <Column flexGrow={1}>
                            <HeaderCell>Nome</HeaderCell>
                            <Cell dataKey="firstName" />
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