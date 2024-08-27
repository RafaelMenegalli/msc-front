// import { useState } from "react";
import styles from "./styles.module.scss";

import { Modal, Button } from "rsuite";
import RemindIcon from '@rsuite/icons/legacy/Remind';

interface DeleteConfirmModalProps {
    open: () => void;
    visible: boolean;
}

export function DeleteConfirmationTeacher({ open, visible }: DeleteConfirmModalProps) {
    return (
        <>
            <Modal open={visible} onClose={open} role="alertdialog" size="xs">
                <Modal.Body className={styles.modalBody}>
                    <RemindIcon style={{ color: '#ff1100', fontSize: 24 }} />
                    Tem certeza que deseja excluir este professor?
                </Modal.Body>

                <Modal.Footer>
                    <Button color="red" appearance="primary" size="sm">
                        Excluir
                    </Button>
                    <Button appearance="subtle" onClick={() => open()}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}