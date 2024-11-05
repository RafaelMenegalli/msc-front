import { useState } from "react";
import { Header } from "@/components/Header";
import styles from "./styles.module.scss";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { Button, Modal, Text, SelectPicker, Input, InputNumber } from "rsuite";
import PlusIcon from '@rsuite/icons/Plus';

export default function AccountPayable() {
    const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
    const [modalSize, setModalSize] = useState<string | number>("");
    const [priceValue, setPriceValue] = useState<number>(0)

    const handleOpen = (value: string | number) => {
        setModalSize(value);
        setAddModalVisible(true);
    };

    const handleClose = () => setAddModalVisible(false);

    return (
        <>
            <Head>
                <title>Contas a Pagar</title>
            </Head>
            <Header title="Contas a Pagar" />

            <div className={styles.container}>
                <div className={styles.buttonToolBar}>
                    <Button
                        appearance="primary"
                        color="green"
                        startIcon={<PlusIcon />}
                        onClick={() => handleOpen(450)} // Define o tamanho do modal
                    >Adicionar</Button>
                </div>
            </div>

            <Modal size={modalSize} open={addModalVisible} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Adicionar nova conta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.formContainer}>
                        <form
                            className={styles.form}
                        >
                            <div className={styles.divFull}>
                                <Text weight={"medium"}>Categoria</Text>
                                <SelectPicker
                                    data={[
                                        { value: 1, label: "Pagamento" },
                                        { value: 2, label: "Conta" },
                                        { value: 3, label: "Outros" },
                                    ]}
                                    placeholder="Selecione a categoria..."
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className={styles.divFull}>
                                <Text weight={"medium"}>Descrição</Text>
                                <Input
                                    type="text"
                                />
                            </div>
                            <div className={styles.divFull}>
                                <Text weight={"medium"}>Valor</Text>
                                <InputNumber
                                    prefix="R$"
                                    step={0.01}
                                    min={0}
                                    decimalSeparator=","
                                    placeholder="Digite o valor"
                                />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleClose}
                        appearance="primary"
                        color="green"
                        style={{ width: "100%" }}
                    >
                        Adicionar Conta
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async () => {
    return {
        props: {

        }
    }
})