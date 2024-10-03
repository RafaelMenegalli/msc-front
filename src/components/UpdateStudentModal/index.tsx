import styles from "./styles.module.scss";
import { Modal, Input, Button, DatePicker, SelectPicker, toaster, Notification } from "rsuite";
import { teacher } from "@/pages/teacher";
import { useState } from "react";
import { api } from "@/services/apiClient";
import { student } from "@/pages/student";
import { formatCPF } from "@/utils/formatCPF";

const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

interface UpdateStudentModalProps {
    setModalVisible: () => void;
    studentToUpdate: student;
    refreshData: () => void;
}

export function UpdateStudentModal({ setModalVisible, studentToUpdate, refreshData }: UpdateStudentModalProps) {
    const [name, setName] = useState<string>(studentToUpdate.name)
    const [email, setEmail] = useState<string>(studentToUpdate.email)
    const [CPF, setCPF] = useState<string>(studentToUpdate.cpf)

    async function handleUpdateStudent() {
        if (!name || !email || !CPF) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todas as informações para atualizar um aluno!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )

            return
        }

        try {
            const formattedCPF = CPF.replace(/\D/g, '')

            await api.put("/students/" + studentToUpdate.id, {
                name: name,
                email: email,
                cpf: formattedCPF
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Aluno atualizado com sucesso!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )

            refreshData()
            setModalVisible()
        } catch (error) {
            console.log("Erro ao atualizar aluno :::>> ", error)

            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao atualizar aluno!
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
                <Modal.Title>Editando aluno: <strong>{studentToUpdate.rm} - {studentToUpdate.name}</strong></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.formContainer}>
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
                            <Label>CPF</Label>
                            <Input
                                type="text"
                                value={CPF}
                                maxLength={14}
                                onChange={e => {
                                    const formattedCpf = formatCPF(e);
                                    setCPF(formattedCpf);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={setModalVisible} appearance="subtle">Cancelar</Button>
                <Button onClick={handleUpdateStudent} appearance="primary" color="green">Atualizar</Button>
            </Modal.Footer>
        </Modal>
    )
}