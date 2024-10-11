import styles from "./styles.module.scss";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import Head from "next/head";
import { LaunchPresenceModal } from "@/components/LaunchPresenceModal";
import { Button, Notification, toaster, List, Text, Input, InputGroup } from 'rsuite';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import { api } from "@/services/apiClient";
import { teacher } from "../teacher";
import axios from "axios";
import { canSSRAuth } from "@/utils/canSSRAuth";
import dayjs from "dayjs";
import SearchIcon from '@rsuite/icons/Search';
import { student } from "../student";

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

interface PresencesProps {
    teachers: teacher[];
    students: student[];
}

type lastStudentClass = {
    name: string;
    date: string;
}

export default function Presences({ teachers, students }: PresencesProps) {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [showHeader, setShowHeader] = useState<boolean>(false);
    const [lastStudent, setLastStudent] = useState<lastStudentClass>();
    const [studentRM, setStudentRM] = useState<string>(''); // Aqui aceita nome ou RM
    const [studentList, setStudentList] = useState<student[]>(students ? students : []);
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

    async function handleSearchRM() {
        alert(studentRM);
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
                    <CustomInputGroupWidthButton
                        size="md"
                        placeholder="Encontrar aluno..."
                        value={studentRM}
                        onChange={(value: string) => setStudentRM(value)}
                    />
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

export const getServerSideProps = canSSRAuth(async () => {
    const teachers = await api.get("/teachers");
    const students = await api.get("/students");

    return {
        props: {
            teachers: teachers ? teachers.data : [],
            students: students ? students.data : []
        }
    };
});
