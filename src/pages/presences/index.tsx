import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import Head from "next/head";
import { LaunchPresenceModal } from "@/components/LaunchPresenceModal";
import { GetServerSideProps } from "next";
import { Button, Notification, toaster, Table, Text } from 'rsuite';
import MenuIcon from '@rsuite/icons/Menu';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import { api } from "@/services/apiClient";
import { teacher } from "../teacher";
import axios from "axios";
import { canSSRAuth } from "@/utils/canSSRAuth";
import dayjs from "dayjs";



interface PresencesProps {
    teachers: teacher[]
}

type lastStudentClass = {
    name: string;
    date: string;
}

export default function Presences({ teachers }: PresencesProps) {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [showHeader, setShowHeader] = useState<boolean>(false)
    const [lastStudent, setLastStudent] = useState<lastStudentClass>()

    const handleModalVisible = () => {
        setModalVisible(!modalVisible)
    }

    async function handleRegisterPresence(studentCode: string, selectedTeacher: string | null, amountClass: number) {
        if (!studentCode || !selectedTeacher || !amountClass) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todas as informações para lançar uma presença!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            return
        }

        try {
            const response = await api.post("/presence", {
                studentRM: studentCode,
                teacherId: selectedTeacher,
                quantityOfClasses: amountClass
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Presença registrada com sucesso!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            )

            const formattedStartDate = dayjs(response.data?.startsAt).add(3, 'hour').format("DD/MM/YYYY HH:mm:ss")

            const lastStudentData: lastStudentClass = {
                name: response.data.student.name,
                date: formattedStartDate
            }

            setLastStudent(lastStudentData)
            setModalVisible(false)
        } catch (error) {
            console.log("Erro ao lançar presença ::::>> ", error)
            if (axios.isAxiosError(error)) {
                toaster.push(
                    <Notification type="error" header="Erro!">
                        {error?.response?.data.message}
                    </Notification>, { placement: "bottomEnd", duration: 3500 }
                )
            }
        }

        try {
            const response = await api.get(`/students/rm/${studentCode}`);
        } catch (error) {
            console.log("Erro ao buscar aluno pelo RM :::>> ", error)
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao buscar aluno!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )
        }
    }

    return (
        <>
            <Head>
                <title>Controle de Aulas</title>
            </Head>

            {showHeader ? (
                <>
                    <Header title="Lançamento de Presença" />
                    <div className={styles.containerMenuIcon}>
                        <ArrowUpLineIcon className={styles.arrowIcon} onClick={() => setShowHeader(!showHeader)} />
                    </div>
                </>
            ) : (
                <div className={styles.containerMenuIcon}>
                    <ArrowDownLineIcon className={styles.arrowIcon} onClick={() => setShowHeader(!showHeader)} />
                </div>
            )}


            <div className={styles.container}>
                <div className={styles.containerButton}>
                    <Button appearance="primary" color="cyan" size="lg" className={styles.presenceButton} onClick={handleModalVisible}>Lançar Presença</Button>
                </div>

                {lastStudent && (
                    <div className={styles.containerText}>
                        <Text>Presença para o aluno: <strong className={styles.evidenceText}>{lastStudent?.name}</strong> foi registrada - {lastStudent?.date}</Text>
                    </div>
                )}
            </div>

            {modalVisible && (
                <LaunchPresenceModal
                    open={handleModalVisible}
                    visible={modalVisible}
                    registerPresence={handleRegisterPresence}
                    teachers={teachers}
                />
            )}
        </>
    )
}

export const getServerSideProps = canSSRAuth(async () => {
    const teachers = await api.get("/teachers")

    return {
        props: {
            teachers: teachers ? teachers.data : []
        }
    }
})