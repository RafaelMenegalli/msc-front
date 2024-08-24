import styles from "./styles.module.scss";
import dayjs from 'dayjs'

import { Modal, Form, Input, Button, DatePicker, SelectPicker, InputGroup } from "rsuite";
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { useEffect, useState } from "react";

const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', marginTop: 10 }} {...props} />;
};

// type ResponsePresenceType = {
//     name: string;
//     classTime: Date;
// }

interface LaunchPresenceModalProps {
    open: () => void;
    visible: boolean;
    registerPresence: () => void;
}

export function LaunchPresenceModal({ open, visible, registerPresence }: LaunchPresenceModalProps) {
    const [password, setPassword] = useState<string>('');
    const [initialDate, setInitialDate] = useState<Date>(new Date())
    const [finalDate, setFinalDate] = useState<Date>()

    const [visibleEye, setVisibleEye] = useState<boolean>(false)

    function handleChange() {
        setVisibleEye(!visibleEye)
    }

    useEffect(() => {
        setFinalDate(dayjs(initialDate).add(1, 'hour').toDate());
    }, [initialDate]);


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
                            <Label>Senha do Aluno</Label>
                            <InputGroup inside className={styles.inputGroup}>
                                <Input
                                    type={visibleEye ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={e => setPassword(e)}
                                />
                                <InputGroup.Button onClick={handleChange}>
                                    {visibleEye ? <EyeIcon /> : <EyeSlashIcon />}
                                </InputGroup.Button>
                            </InputGroup>
                        </div>
                        <div className={styles.formGroup}>
                            <Label>Professor</Label>
                            <SelectPicker
                                data={[{ value: 1, label: "Rafael" }]}
                                style={{ width: '100%' }}
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
                                    />
                                </div>
                            </div>
                        </div>
                        <Button color="cyan" className={styles.sendButton} appearance="primary" size="sm" onClick={registerPresence}>Lançar</Button>
                    </div>
                </Modal.Body>


                {/* <Modal.Footer >
                    <Button appearance="subtle" onClick={() => open()}>Cancelar</Button>
                </Modal.Footer> */}
            </Modal >
        </>
    )
}