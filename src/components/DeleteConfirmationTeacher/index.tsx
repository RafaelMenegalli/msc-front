import { useState } from "react";
import { Modal, Button } from "rsuite";

interface DeleteConfirmModalProps {
    open: () => void;
    visible: boolean;
}

export function DeleteConfirmationTeacher({ open, visible }: DeleteConfirmModalProps) {
    return (
        <>
            <Modal open={visible} onClose={open}>
                <Modal.Header>Confirmar exclusão de professor</Modal.Header>

                <Modal.Body>
                    Tem certeza que deseja excluir este item?
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