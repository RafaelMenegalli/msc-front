import styles from "./styles.module.scss";
import dayjs from 'dayjs'
import { Modal, Input, Button, DatePicker, SelectPicker } from "rsuite";
import { useEffect, useState } from "react";
import { teacher } from "@/pages/teacher";

const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', marginTop: 10 }} {...props} />;
};

interface LaunchPresenceModalProps {
    open: () => void;
    visible: boolean;
    registerPresence: () => void;
    teachers: teacher[]
}

export function LaunchPresenceModal({ open, visible, registerPresence, teachers }: LaunchPresenceModalProps) {
    const [initialDate, setInitialDate] = useState<Date>(new Date())
    const [finalDate, setFinalDate] = useState<Date | null>(null)
    const [teacherList, setTeacherList] = useState<{ label: string, value: string }[]>([])
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
    const [studentCode, setStudentCode] = useState<string>("")
    const [amountClass, setAmountClass] = useState<number>(0)

    useEffect(() => {
        if (amountClass) {
            setFinalDate(dayjs(initialDate).add(amountClass, 'hour').toDate());
        }
    }, [amountClass]);

    useEffect(() => {
        if (teachers.length > 0) {
            const formattedValue = teachers.map((item) => {
                return { label: item.name, value: item.id };
            });
            setTeacherList(formattedValue);
        }
    }, [teachers])


    return (
        <>
            <Modal
                open={visible}
                onClose={open}
                size="lg"
            >
                <Modal.Header>
                    <Modal.Title>Lançamento de Presença</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <Label>Código do aluno</Label>
                            <Input
                                type="text"
                                maxLength={7}
                                value={studentCode}
                                onChange={(value) => {
                                    const numericValue = value.replace(/\D/g, '')
                                    setStudentCode(numericValue)
                                }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <Label>Professor</Label>
                            <SelectPicker
                                data={teacherList}
                                style={{ width: '100%' }}
                                placeholder="Selecione um professor..."
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <Label>Quantidade de Aulas</Label>
                            <SelectPicker
                                data={[
                                    { value: 1, label: "1" },
                                    { value: 2, label: "2" },
                                    { value: 3, label: "3" },
                                    { value: 4, label: "4" },
                                    { value: 5, label: "5" }
                                ]}
                                style={{ width: '100%' }}
                                placeholder="Selecione..."
                                value={amountClass}
                                onChange={(value) => {
                                    if (value) {
                                        setAmountClass(value)
                                    }
                                }}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.containerDates}>
                                <div>
                                    <Label>Horário de Início</Label>
                                    <DatePicker
                                        className={styles.datePiker}
                                        format="HH:mm:ss"
                                        value={initialDate}
                                        disabled
                                    />
                                </div>

                                <div>
                                    <Label>Horário de Fim</Label>
                                    <DatePicker
                                        className={styles.datePiker}
                                        format="HH:mm:ss"
                                        value={finalDate}
                                        disabled
                                        placeholder="Selecione a Quantidade de Aulas"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button color="cyan" className={styles.sendButton} appearance="primary" size="sm" onClick={registerPresence}>Lançar</Button>
                    </div>
                </Modal.Body>
            </Modal >
        </>
    )
}