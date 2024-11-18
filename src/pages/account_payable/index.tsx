import { useState } from "react";
import { Header } from "@/components/Header";
import styles from "./styles.module.scss";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { Button, Modal, Text, SelectPicker, Input, InputNumber, DatePicker, InputGroup, Table, Divider, ButtonToolbar } from "rsuite";
import PlusIcon from '@rsuite/icons/Plus';
import SearchIcon from '@rsuite/icons/Search';
import EditIcon from '@rsuite/icons/Edit';
import TagFilterIcon from '@rsuite/icons/TagFilter';
import CloseIcon from '@rsuite/icons/Close';

const { Column, HeaderCell, Cell } = Table;

const CustomInputGroupWidthButton = ({ placeholder, value, onChange, ...props }: any) => (
    <InputGroup {...props} inside style={{ width: '400px' }}>
        <Input
            placeholder={placeholder}
            type="text"
            value={value}
            // onChange={(value) => onChange(value)}
            autoComplete="off"
        />
        <InputGroup.Button>
            <SearchIcon />
        </InputGroup.Button>
    </InputGroup>
);

const StatusCell = ({ rowData, dataKey, ...props }: any) => {
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paga':
                return {
                    backgroundColor: '#D4EDDA', // Verde claro
                    color: '#155724', // Verde escuro
                };
            case 'pendente':
                return {
                    backgroundColor: '#FFF3CD', // Amarelo claro
                    color: '#856404', // Amarelo escuro
                };
            case 'cancelada':
                return {
                    backgroundColor: '#F8D7DA', // Vermelho claro
                    color: '#721C24', // Vermelho escuro
                };
            default:
                return {
                    backgroundColor: '#E2E3E5', // Cinza claro
                    color: '#6C757D', // Cinza escuro
                };
        }
    };

    return (
        <Cell {...props} style={{ display: "flex", alignItems: "center" }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // padding: '4px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    width: '85px',
                    ...getStatusStyle(rowData[dataKey]),
                }}
            >
                {rowData[dataKey]}
            </div>
        </Cell>
    );
};

export default function AccountPayable() {
    const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
    const [modalSize, setModalSize] = useState<string | number>("");
    const [priceValue, setPriceValue] = useState<number>(0);
    const [loadingTable, setLoadingTable] = useState<boolean>(false)

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
                        onClick={() => handleOpen(450)}
                    >Adicionar</Button>
                </div>

                <Divider>Contas</Divider>

                <div className={styles.containerTable}>
                    <div className={styles.containerFilter}>
                        <CustomInputGroupWidthButton
                            size="md"
                            placeholder="Pesquise por uma conta..."
                        />
                        {/* 
                        <div className={styles.containerButton}>
                            <ButtonToolbar>
                                <Button appearance="primary" type="submit" color="violet" startIcon={<TagFilterIcon />} onClick={() => { }}>
                                    Filtrar
                                </Button>
                                <Button appearance="primary" type="submit" color="cyan" startIcon={<CloseIcon />} onClick={() => { }}>
                                    Limpar Filtros
                                </Button>
                            </ButtonToolbar>
                        </div> */}
                    </div>
                    <div>
                        <Table
                            height={350}
                            data={[
                                { category: "Conta", description: "Conta de Luz", amount: "R$ 150,50", dueDate: "15/11/2024", status: "Pendente" }
                            ]}
                            className={styles.table}
                            loading={loadingTable}
                            renderEmpty={() => <Text className={styles.emptyText}>Sem contas cadastradas...</Text>}
                        >

                            <Column flexGrow={1}>
                                <HeaderCell>Categoria</HeaderCell>
                                <Cell dataKey="category" />
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>Descrição</HeaderCell>
                                <Cell dataKey="description" />
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>Valor</HeaderCell>
                                <Cell dataKey="amount" />
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>Data de Vencimento</HeaderCell>
                                <Cell dataKey="dueDate" />
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>Status</HeaderCell>
                                <StatusCell dataKey="status" />
                            </Column>

                            <Column width={75} fixed="right">
                                <HeaderCell>Ações</HeaderCell>
                                <Cell style={{ display: "flex", alignItems: "center" }}>
                                    {rowData => (
                                        <>
                                            <EditIcon
                                                className={styles.buttonEditIcon}
                                            />
                                        </>
                                    )}
                                </Cell>
                            </Column>
                        </Table>
                    </div>
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
                                    autoComplete="off"
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
                            <div className={styles.divFull}>
                                <Text weight={"medium"}>Data de Vencimento</Text>
                                <DatePicker
                                    format="dd/MM/yyyy"
                                    placement="autoVerticalStart"
                                    placeholder="Selecione uma data..."
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