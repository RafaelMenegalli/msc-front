import styles from "./styles.module.scss";

import { Modal, Form, Input, Button, DatePicker, SelectPicker } from "rsuite";

const Label = (props: any) => {
    return <label style={{ width: 120, display: 'inline-block', marginTop: 10 }} {...props} />;
};

interface LaunchPresenceModalProps {
    open: () => void;
    visible: boolean;
}

export function LaunchPresenceModal({ open, visible }: LaunchPresenceModalProps) {
    return (
        <>
            <Modal open={visible} onClose={open} size="lg">
                <Modal.Title>Lançamento de Presença</Modal.Title>

                <Modal.Body>
                    <div className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <Label>Horário Início</Label>
                            <DatePicker
                                format="HH:mm"
                                defaultValue={new Date()}
                                // hideHours={hour => hour < 8 || hour > 18}
                                hideMinutes={minute => minute % 15 !== 0}
                            // hideSeconds={second => second % 30 !== 0}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <Label>Aluno</Label>
                            <SelectPicker
                                data={[]}
                                style={{ width: 224 }}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <Label>Professor</Label>
                            <SelectPicker
                                data={[]}
                                style={{ width: 224 }}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <Label>Horário Fim</Label>
                            <DatePicker
                                format="HH:mm"
                                defaultValue={new Date()}
                                // hideHours={hour => hour < 8 || hour > 18}
                                hideMinutes={minute => minute % 15 !== 0}
                            // hideSeconds={second => second % 30 !== 0}
                            />
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button color="green" appearance="primary" size="sm">Lançar</Button>
                    <Button appearance="subtle" onClick={() => open()}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}