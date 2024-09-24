import styles from "./styles.module.scss";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Header } from "@/components/Header";
import { api } from "@/services/apiClient";
import { Button, Input, InputGroup, Notification, toaster } from "rsuite";
import { canSSRAuth } from "@/utils/canSSRAuth";

const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

interface SettingsProps {
    settings: {
        id: number;
        classDurationInMinutes: number;
    }
}

export default function Settings({ settings }: SettingsProps) {
    const [classDurationInMinutes, setClassDurationInMinutes] = useState<number | string>(settings.classDurationInMinutes ? settings.classDurationInMinutes : "")

    async function handleUpdateSettings() {
        if (!classDurationInMinutes) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha o campo de Duração da Aula para atualizar as configurações!
                </Notification>,
                { duration: 3500, placement: 'bottomEnd' }
            )

            return
        }

        try {
            await api.post("/config", {
                classDurationInMinutes: Number(classDurationInMinutes)
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Configurações atualizadas com sucesso!
                </Notification>,
                { duration: 3500, placement: 'bottomEnd' }
            )
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao atualizar configurações!
                </Notification>,
                { duration: 3500, placement: 'bottomEnd' }
            )

            console.log("Erro ao atualizar configurações ::::>> ", error)
        }

    }

    return (
        <>
            <Head>
                <title>Configurações</title>
            </Head>
            <Header title="Configurações" />
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <Label>Tempo da Aula</Label>
                        <InputGroup>
                            <Input
                                type="number"
                                min={0}
                                value={classDurationInMinutes}
                                onChange={(value) => setClassDurationInMinutes(value)}
                                autoComplete="off"
                            />
                            <InputGroup.Addon>min</InputGroup.Addon>
                        </InputGroup>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <Button onClick={handleUpdateSettings}>Atualizar Configurações</Button>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async () => {
    try {
        const settings = await api.get("/config")

        console.log(settings.data)

        return {
            props: {
                settings: settings.data
            }
        }
    } catch (error) {
        console.log(error)
        return {
            props: {
                settings: {}
            }
        }
    }
})