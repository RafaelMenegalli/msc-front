import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { Header } from "@/components/Header";
import Head from "next/head";
import { Modal, Input, Button, DatePicker, SelectPicker, Divider, Table } from "rsuite";
import { student } from "../student";
import { teacher } from "../teacher";
import { api } from "@/services/apiClient";

const { Column, HeaderCell, Cell } = Table;

const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block' }} {...props} />;
};

interface HistoryPresencesProps {
    students: student[],
    teachers: teacher[]
}


export default function HistoryPresences({ students, teachers }: HistoryPresencesProps) {
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);
    const [studentList, setStudentList] = useState<{ label: string, value: number }[]>([])
    const [teacherList, setTeacherList] = useState<{ label: string, value: number }[]>([])
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null)
    const [date, setDate] = useState<Date | null>(null)

    useEffect(() => {
        const formatStudent = students.map((item) => {
            return { label: `${item.rm} - ${item.name}`, value: item.id }
        })

        const formatTeacher = teachers.map((item) => {
            return { label: item.name, value: item.id }
        })

        setStudentList(formatStudent)
        setTeacherList(formatTeacher)
    }, [])

    const handleSortColumn = (sortColumn: any, sortType: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);

    }

    return (
        <>
            <Head>
                <title>Histórico de Presença - MSCFront</title>
            </Head>
            <Header title="Histórico de Presença" />

            <div className={styles.container}>
                <Divider>Filtros</Divider>
                <div className={styles.filtersContainer}>
                    <div style={{ gridColumn: 'span 3' }}>
                        <Label>Aluno</Label>
                        <SelectPicker
                            data={studentList}
                            style={{ width: '100%' }}
                            placeholder="Selecione um aluno..."
                            value={selectedStudent}
                            onChange={(value) => setSelectedStudent(value)}
                        />
                    </div>

                    <div style={{ gridColumn: 'span 3' }}>
                        <Label>Professor</Label>
                        <SelectPicker
                            data={teacherList}
                            style={{ width: '100%' }}
                            placeholder="Selecione um professor..."
                            value={selectedTeacher}
                            onChange={(value) => setSelectedTeacher(value)}
                        />
                    </div>

                    <div style={{ gridColumn: 'span 3' }}>
                        <Label>Data</Label>
                        <DatePicker
                            format="dd/MM/yyyy"
                            placeholder="Escolha uma data..."
                            value={date}
                            onChange={(value) => setDate(value)}
                        />
                    </div>
                </div>
                <Divider>Aulas</Divider>
                <div className={styles.tableContainer}>
                    <Table
                        height={420}
                        data={[]}
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={loading}
                    >

                    </Table>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = (async () => {
    try {
        const students = await api.get("/students");
        const teachers = await api.get("/teachers")

        return {
            props: {
                students: students.data,
                teachers: teachers.data
            }
        }
    } catch (error) {
        console.log("Erro ao buscar dados ::::>> ", error)
        return {
            props: {
                students: [],
                teachers: []
            }
        }
    }
})