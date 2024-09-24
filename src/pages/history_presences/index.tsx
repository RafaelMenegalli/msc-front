import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { Header } from "@/components/Header";
import Head from "next/head";
import { Modal, Input, Button, DatePicker, SelectPicker, Divider, Table } from "rsuite";
import { student } from "../student";
import { teacher } from "../teacher";
import { api } from "@/services/apiClient";
import { canSSRAuth } from "@/utils/canSSRAuth";

const { Column, HeaderCell, Cell } = Table;

const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block' }} {...props} />;
};

interface HistoryPresencesProps {
    students: student[],
    teachers: teacher[]
}

export default function HistoryPresences({ students, teachers }: HistoryPresencesProps) {
    const [sortColumn, setSortColumn] = useState<string | undefined>();
    const [sortType, setSortType] = useState<'asc' | 'desc' | undefined>();
    const [loading, setLoading] = useState(false);
    const [studentList, setStudentList] = useState<{ label: string, value: number }[]>([])
    const [teacherList, setTeacherList] = useState<{ label: string, value: number }[]>([])
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null)
    const [date, setDate] = useState<Date | null>(null)
    const [data, setData] = useState([
        { student: "Rafael", teacher: "Eduardo", amountClass: 4, initialDate: "22/22/2005", finalDate: "11/11/2005" },
        { student: "Maria", teacher: "João", amountClass: 6, initialDate: "03/03/2010", finalDate: "09/09/2010" },
        { student: "Carlos", teacher: "Ana", amountClass: 5, initialDate: "15/07/2012", finalDate: "15/12/2012" },
        { student: "Fernanda", teacher: "Ricardo", amountClass: 3, initialDate: "01/04/2018", finalDate: "30/04/2018" },
        { student: "Lucas", teacher: "Mariana", amountClass: 7, initialDate: "20/02/2015", finalDate: "20/08/2015" },
        { student: "Julia", teacher: "Paulo", amountClass: 2, initialDate: "10/10/2019", finalDate: "20/11/2019" },
        { student: "Pedro", teacher: "Camila", amountClass: 8, initialDate: "05/05/2014", finalDate: "05/12/2014" },
        { student: "Larissa", teacher: "Felipe", amountClass: 4, initialDate: "12/12/2020", finalDate: "12/04/2021" },
        { student: "Gabriel", teacher: "Roberta", amountClass: 6, initialDate: "07/07/2017", finalDate: "07/12/2017" },
        { student: "Marcos", teacher: "Vanessa", amountClass: 9, initialDate: "03/03/2011", finalDate: "03/09/2011" }
    ]);

    useEffect(() => {
        const formatStudent = students.map((item) => {
            return { label: `${item.rm} - ${item.name}`, value: item.id }
        });

        const formatTeacher = teachers.map((item) => {
            return { label: item.name, value: item.id }
        });

        setStudentList(formatStudent);
        setTeacherList(formatTeacher);
    }, [students, teachers]);

    const handleSortColumn = (sortColumn: string, sortType: 'asc' | 'desc' | undefined) => {
        setLoading(true);

        // Definindo um valor padrão para sortType caso seja undefined
        const finalSortType = sortType || 'asc';

        const sortedData = [...data].sort((a, b) => {
            const aValue = a[sortColumn as keyof typeof a];
            const bValue = b[sortColumn as keyof typeof b];

            if (finalSortType === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setTimeout(() => {
            setLoading(false);
            setSortColumn(sortColumn);
            setSortType(finalSortType);
            setData(sortedData);
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
                        data={data}
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={loading}
                    >
                        <Column flexGrow={1} align="center" sortable>
                            <HeaderCell>Aluno</HeaderCell>
                            <Cell dataKey="student" />
                        </Column>

                        <Column flexGrow={1} sortable>
                            <HeaderCell>Professor</HeaderCell>
                            <Cell dataKey="teacher" />
                        </Column>

                        <Column flexGrow={1} sortable>
                            <HeaderCell>Quantidade de Aulas</HeaderCell>
                            <Cell dataKey="amountClass" />
                        </Column>

                        <Column flexGrow={1} sortable>
                            <HeaderCell>Inicio Aula</HeaderCell>
                            <Cell dataKey="initialDate" />
                        </Column>

                        <Column flexGrow={1} sortable>
                            <HeaderCell>Fim Aula</HeaderCell>
                            <Cell dataKey="finalDate" />
                        </Column>
                    </Table>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async () => {
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
