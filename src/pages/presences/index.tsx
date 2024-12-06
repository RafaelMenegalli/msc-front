import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import Head from "next/head";
import { LaunchPresenceModal } from "@/components/LaunchPresenceModal";
import { Button, Notification, toaster, List, Text, Input, InputGroup, Whisper, Popover } from 'rsuite';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import { api } from "@/services/apiClient";
import { teacher } from "../teacher";
import axios from "axios";
import { canSSRAuth } from "@/utils/canSSRAuth";
import dayjs from "dayjs";
import SearchIcon from '@rsuite/icons/Search';
import ReloadIcon from '@rsuite/icons/Reload';
import { student } from "../student";
import { setupAPIClient } from "@/services/api";

const CustomInputGroupWidthButton = ({ placeholder, value, onChange, ...props }: any) => (
    <InputGroup {...props} inside style={{ width: '400px' }}>
        <Input
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={(value) => onChange(value)}
            autoComplete="off"
        />
        <InputGroup.Button>
            <SearchIcon />
        </InputGroup.Button>
    </InputGroup>
);

const speaker = (
    <Popover>
        <p>Se o seu nome não aparecer na lista, clique no botão abaixo para atualizar a lista de alunos.</p>
    </Popover>
);

interface PresencesProps {
    teachers: teacher[];
    studentsProps: student[];
}

type lastStudentClass = {
    name: string;
    date: string;
}

export default function Presences({ teachers, studentsProps }: PresencesProps) {
    const [students, setStudents] = useState<student[]>(studentsProps ? studentsProps : [])
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [showHeader, setShowHeader] = useState<boolean>(false);
    const [lastStudent, setLastStudent] = useState<lastStudentClass>();
    const [studentRM, setStudentRM] = useState<string>(''); // Aqui aceita nome ou RM
    const [studentList, setStudentList] = useState<student[]>(students ? students : []);
    const [loadingRefreshButton, setLoadingRefreshButton] = useState<boolean>(false)
    const [confirmPresenceModal, setConfirmPresenceModal] = useState<Boolean>(false)

    useEffect(() => {
        if (studentRM === '') {
            setStudentList(students); // Se o campo estiver vazio, mostre todos os estudantes
        } else {
            const filteredStudents = students.filter((student) =>
                student.rm.includes(studentRM) || student.name.toLowerCase().includes(studentRM.toLowerCase()) // Verifica RM ou Nome
            );
            setStudentList(filteredStudents);
        }
    }, [studentRM, students]);

    const handleModalVisible = () => {
        setModalVisible(!modalVisible);
    }

    async function handleRegisterPresence(studentCode: string, selectedTeacher: string | null, amountClass: number) {
        if (!studentCode || !selectedTeacher || !amountClass) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha todas as informações para lançar uma presença!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            );

            return;
        }

        try {
            const response = await api.post("/presence", {
                studentRM: studentCode,
                teacherId: selectedTeacher,
                quantityOfClasses: amountClass
            });

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Presença registrada com sucesso!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            );

            const formattedStartDate = dayjs(response.data?.startsAt).add(3, 'hour').format("DD/MM/YYYY HH:mm:ss");

            const lastStudentData: lastStudentClass = {
                name: response.data.student.name,
                date: formattedStartDate
            };

            setLastStudent(lastStudentData);
            setModalVisible(false);
        } catch (error) {
            console.log("Erro ao lançar presença ::::>> ", error);
            if (axios.isAxiosError(error)) {
                toaster.push(
                    <Notification type="error" header="Erro!">
                        {error?.response?.data.message}
                    </Notification>, { placement: "bottomEnd", duration: 3500 }
                );
            }
        }

        try {
            const response = await api.get(`/students/rm/${studentCode}`);
        } catch (error) {
            console.log("Erro ao buscar aluno pelo RM :::>> ", error);
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao buscar aluno!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            );
        }
    }

    async function handleRefreshStudents() {
        setLoadingRefreshButton(true)

        try {
            const students = await api.get("/students")

            setStudentList(students.data)
            setStudents(students.data)
            setLoadingRefreshButton(false)
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao buscar alunos!
                </Notification>, { placement: "bottomEnd", duration: 3500 }
            );

            setLoadingRefreshButton(false)
            console.log({ error })
        }
    }

    return (
        <>
            <Head>
                <title>Controle de Aulas</title>
            </Head>

            {showHeader ? (
                <>
                    {/* <Header title="Lançamento de Presença" /> */}
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
                    <Button appearance="primary" color="cyan" size="lg" className={styles.presenceButton} onClick={handleModalVisible}>
                        Lançar Presença
                    </Button>
                </div>

                {lastStudent && (
                    <div className={styles.containerText}>
                        <Text>Presença para o aluno: <strong className={styles.evidenceText}>{lastStudent?.name}</strong> foi registrada - {lastStudent?.date}</Text>
                    </div>
                )}

                <div className={styles.searchInputContainer}>
                    <div className={styles.buttonToolBar}>
                        <CustomInputGroupWidthButton
                            size="md"
                            placeholder="Encontrar aluno..."
                            value={studentRM}
                            onChange={(value: string) => setStudentRM(value)}
                        />
                        <Whisper placement="top" trigger="hover" controlId="control-id-hover-enterable" speaker={speaker} enterable>
                            <Button startIcon={<ReloadIcon className={styles.reloadIcon} />} appearance="primary" color="violet" onClick={handleRefreshStudents} loading={loadingRefreshButton}></Button>
                        </Whisper>
                    </div>
                    <List bordered style={{ width: '50%', height: '200px' }}>
                        {studentList.map((item: student) => (
                            <List.Item key={item.id}>{item.rm} - {item.name}</List.Item>
                        ))}
                    </List>
                </div>
            </div>


            <LaunchPresenceModal
                open={handleModalVisible}
                visible={modalVisible}
                registerPresence={handleRegisterPresence}
                teachers={teachers}
                students={students}
            />

        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const teachers = await apiClient.get("/teachers");
    const students = await apiClient.get("/students");

    return {
        props: {
            teachers: teachers ? teachers.data : [],
            studentsProps: students ? students.data : []
        }
    };
});
