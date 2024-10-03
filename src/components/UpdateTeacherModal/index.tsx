import styles from "./styles.module.scss";
import { Modal, Input, Button, DatePicker, SelectPicker, toaster, Notification } from "rsuite";
import { teacher } from "@/pages/teacher";
import { useState } from "react";
import { api } from "@/services/apiClient";

const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

interface UpdateTeacherModalProps {
    teacher: teacher;
    setModalVisible: () => void;
    refreshData: () => void;
}

export function UpdateTeacherModal({ teacher, setModalVisible, refreshData }: UpdateTeacherModalProps) {
    const [name, setName] = useState<string>(teacher.name)
    const [email, setEmail] = useState<string>(teacher.email)

    async function handleUpdateTeacher() {
        if (!name || !email) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Preencha todas as informações para atualizar um professor!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )

            return
        }

        try {
            await api.put("/teachers/" + teacher.id, {
                name: name,
                email: email
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Professor atualizado com sucesso!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )

            refreshData()
            setModalVisible()
        } catch (error) {
            console.log("Erro ao atualizar professor :::>> ", error)

            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao atualizar professor!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )
        }
    }

    return (
        <Modal
            open
            onClose={setModalVisible}
            size="lg"
        >
            <Modal.Header>
                <Modal.Title>Editando professor: <strong>{teacher.name}</strong></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.formContainer}>
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
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={setModalVisible} appearance="subtle">Cancelar</Button>
                <Button onClick={handleUpdateTeacher} appearance="primary" color="green">Atualizar</Button>
            </Modal.Footer>
        </Modal>
    )
}