import styles from "./styles.module.scss";
import { Modal, Button } from "rsuite";

interface ConfirmPresenceModalProps {
    handleClose: () => void;
    onConfirm: () => void;
}

export function ConfirmPresenceModal({ handleClose, onConfirm }: ConfirmPresenceModalProps) {
    return (
        <>
            <div className={styles.container}>
                <Modal
                    open={true}
                    size="xs"
                >
                    <Modal.Header style={{ textAlign: 'center' }}>
                        <Modal.Title>Confirmação de presença</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Você tem certeza que deseja confirmar a presença?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={handleClose} appearance="subtle">Cancelar</Button>
                        <Button onClick={onConfirm} appearance="primary" color="cyan">Confirmar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}
