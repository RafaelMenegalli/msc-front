import { Modal, Input, Button, SelectPicker, Notification, toaster, Text } from "rsuite";
import { useState, useEffect } from "react";
import { teacher } from "@/pages/teacher";
import styles from "./styles.module.scss";
import { student } from "@/pages/student";

interface LaunchPresenceModalProps {
    open: () => void;
    visible: boolean;
    registerPresence: (studentCode: string, selectedTeacher: string | null, amountClass: number) => void;
    teachers: teacher[];
    students: student[];
}

interface confirmModalInformationProps {
    student_name: string;
    teacher_name: string;
    amount_class: number;
}

export function LaunchPresenceModal({ open, visible, registerPresence, teachers, students }: LaunchPresenceModalProps) {
    const [teacherList, setTeacherList] = useState<{ label: string, value: string }[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
    const [studentCode, setStudentCode] = useState<string>("");
    const [amountClass, setAmountClass] = useState<number>(0);
    const [confirmPresenceModal, setConfirmPresenceModal] = useState<boolean>(false); // Modal de confirmação
    const [confirmModalInformations, setConfirmModalInformations] = useState<confirmModalInformationProps | null>(null)

    useEffect(() => {
        if (teachers.length > 0) {
            const formattedValue = teachers.map((item) => ({
                label: item.name,
                value: String(item.id)
            }));
            setTeacherList(formattedValue);
        }
    }, [teachers]);

    // Alterna a visibilidade do modal de confirmação
    const handleConfirmModalVisible = () => {
        if (!studentCode || !selectedTeacher || !amountClass) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todas as informações para lançar a presença!
                </Notification>,
                { placement: "bottomEnd", duration: 3500 }
            );
            return;
        }

        const studentName = students.find(item => item.rm === studentCode)
        const teacherName = teachers.find(item => item.id === Number(selectedTeacher))

        const data = {
            student_name: studentName?.name || "", // Fallback para string vazia se for undefined
            teacher_name: teacherName?.name || "", // Fallback para string vazia se for undefined
            amount_class: amountClass
        };

        setConfirmModalInformations(data)
        setConfirmPresenceModal(!confirmPresenceModal);
    };

    // Função para confirmar e lançar presença
    const confirmAndRegisterPresence = () => {
        handleConfirmModalVisible(); // Fecha o modal de confirmação
        registerPresence(studentCode, selectedTeacher, amountClass); // Chama a função de registrar a presença
    };

    return (
        <>
            {/* Modal principal */}
            <Modal
                open={visible}
                onClose={() => {
                    open()
                    setSelectedTeacher(null)
                    setStudentCode("")
                    setAmountClass(0)
                }}
                size="lg"
            >
                <Modal.Header>
                    <Modal.Title>Lançamento de Presença</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <label>Código do aluno</label>
                            <Input
                                type="text"
                                maxLength={7}
                                value={studentCode}
                                onChange={(value) => {
                                    const numericValue = value.replace(/\D/g, '');
                                    setStudentCode(numericValue);
                                }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Professor</label>
                            <SelectPicker
                                data={teacherList}
                                style={{ width: '100%' }}
                                placeholder="Selecione um professor..."
                                value={selectedTeacher}
                                onChange={(value) => setSelectedTeacher(value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Quantidade de Aulas</label>
                            <SelectPicker
                                data={[
                                    { value: 1, label: "1" },
                                    { value: 2, label: "2" }
                                ]}
                                style={{ width: '100%' }}
                                placeholder="Selecione..."
                                value={amountClass}
                                onChange={(value) => setAmountClass(value ? value : 0)}
                            />
                        </div>

                        <Button color="cyan" className={styles.sendButton} appearance="primary" size="sm" onClick={handleConfirmModalVisible}>
                            Lançar
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal de Confirmação */}
            <Modal open={confirmPresenceModal} onClose={handleConfirmModalVisible} size="sm">
                <Modal.Header>
                    <Modal.Title>Confirmar Lançamento!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Text>Aluno: <strong className={styles.evidenceText}>{confirmModalInformations?.student_name}</strong></Text>
                        <Text>Professor: <strong className={styles.evidenceText}>{confirmModalInformations?.teacher_name}</strong></Text>
                        <Text>Quantidade de Aulas: <strong className={styles.evidenceText}>{confirmModalInformations?.amount_class}</strong></Text>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={confirmAndRegisterPresence} color="cyan" appearance="primary">
                        Confirmar
                    </Button>
                    <Button onClick={handleConfirmModalVisible} appearance="subtle">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
