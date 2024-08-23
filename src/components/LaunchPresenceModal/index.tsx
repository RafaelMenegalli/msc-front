import styles from "./styles.module.scss";

import { Modal, Form, Input, Button, DatePicker, SelectPicker } from "rsuite";

const Label = (props: any) => {
    return <label style={{ width: 120, display: 'inline-block', marginTop: 10 }} {...props} />;
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
    return (
        <>
            <Modal
                open={visible}
                onClose={open}
                size="lg"
            >
                <Modal.Title>Lançamento de Presença</Modal.Title>

                <Modal.Body>
                    <div className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <Label>Horário Início</Label>
                            <DatePicker
                                format="HH:mm"
                                defaultValue={new Date()}
                                hideMinutes={minute => minute % 15 !== 0}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <Label>Aluno</Label>
                            <SelectPicker
                                data={[{ value: 1, label: "Rafael" }]}
                                style={{ width: 224 }}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <Label>Professor</Label>
                            <SelectPicker
                                data={[{ value: 1, label: "Rafael" }]}
                                style={{ width: 224 }}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <Label>Horário Fim</Label>
                            <DatePicker
                                format="HH:mm"
                                defaultValue={new Date()}
                                hideMinutes={minute => minute % 15 !== 0}
                            />
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button color="green" appearance="primary" size="sm" onClick={registerPresence}>Lançar</Button>
                    <Button appearance="subtle" onClick={() => open()}>Cancelar</Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}