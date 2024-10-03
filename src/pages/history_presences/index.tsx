import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Head from "next/head";
import { Button, DatePicker, SelectPicker, Divider, Table, ButtonToolbar, toaster, Notification, DateRangePicker } from "rsuite";
import TagFilterIcon from '@rsuite/icons/TagFilter';
import CloseIcon from '@rsuite/icons/Close';
import { student } from "../student";
import { teacher } from "../teacher";
import { api } from "@/services/apiClient";
import { canSSRAuth } from "@/utils/canSSRAuth";
import dayjs from "dayjs";
import { DateRange } from "rsuite/esm/DateRangePicker/types";
import ptBR from 'rsuite/locales/pt_BR'

const { Column, HeaderCell, Cell } = Table;

const Label = (props: any) => {
    return <label style={{ width: '100%', display: 'inline-block' }} {...props} />;
};

const customLocale = {
    placeholder: 'Selecione o intervalo de datas',
    today: 'Hoje',
    yesterday: 'Ontem',
    last7Days: 'Últimos 7 dias',
    ok: 'Confirmar',
    clear: 'Limpar',
    startDate: 'Data de Início',
    endDate: 'Data de Fim',
    dateLocale: ptBR.DateRangePicker.dateLocale // Mantendo o `dateLocale` existente do arquivo de localização
};

type Presence = {
    id: number;
    student: {
        id: number;
        name: string;
        email: string;
    }
    teacher: {
        id: number;
        name: string;
        email: string;
    }
    quantityOfClasses: number;
    startsAt: Date | string;
    endsAt: Date | string;
}

interface HistoryPresencesProps {
    students: student[],
    teachers: teacher[],
    presences: Presence[]
}


export default function HistoryPresences({ students, teachers, presences }: HistoryPresencesProps) {
    const [sortColumn, setSortColumn] = useState<string | undefined>();
    const [sortType, setSortType] = useState<'asc' | 'desc' | undefined>();
    const [loading, setLoading] = useState(false);
    const [studentList, setStudentList] = useState<{ label: string, value: number }[]>([])
    const [teacherList, setTeacherList] = useState<{ label: string, value: number }[]>([])
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null)
    // const [initialDate, setInitialDate] = useState<Date | null>(null)
    // const [finalDate, setFinalDate] = useState<Date | null>(null)
    const [presenceList, setPresenceList] = useState<Presence[]>(presences)
    const [initialFinalDate, setInitialFinalDate] = useState<DateRange | null>(null)

    useEffect(() => {
        console.log({ initialFinalDate })
    }, [initialFinalDate])

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

        // Definindo um valor padrão para sortType caso seja undefinedl
        const finalSortType = sortType || 'asc';

        const sortedData = [...presenceList].sort((a, b) => {
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
            setPresenceList(sortedData);
        }, 500);
    }

    async function handleClearFilters() {
        setLoading(true)
        setSelectedStudent(null)
        setSelectedTeacher(null)
        // setInitialDate(null)
        // setFinalDate(null)
        setInitialFinalDate(null)

        try {
            const response = await api.get("/presence")
            setPresenceList(response.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao filtrar aulas!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            )
        }
    }

    async function handleFilterData() {
        setLoading(true);

        try {
            let formattedInitialDate = null;
            let formattedFinalDate = null;

            // Apenas formata a data se o intervalo de data foi selecionado
            if (initialFinalDate && initialFinalDate.length === 2) {
                const convertInitialDate = new Date(initialFinalDate[0]);
                const convertFinalDate = new Date(initialFinalDate[1]);

                formattedInitialDate = dayjs(convertInitialDate).isValid() ? dayjs(convertInitialDate).format("YYYY-MM-DD") : null;
                formattedFinalDate = dayjs(convertFinalDate).isValid() ? dayjs(convertFinalDate).format("YYYY-MM-DD") : null;
            }

            // Envia os parâmetros condicionais para o filtro
            const response = await api.get('/presence', {
                params: {
                    studentId: selectedStudent || undefined,
                    teacherId: selectedTeacher || undefined,
                    startDate: formattedInitialDate || undefined,
                    endDate: formattedFinalDate || undefined,
                }
            });

            setPresenceList(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao filtrar aulas!
                </Notification>, { placement: 'bottomEnd', duration: 3500 }
            );
        }
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
                        <Label>Data Início - Fim</Label>
                        <DateRangePicker
                            format="dd/MM/yyyy"
                            character=" – "
                            value={initialFinalDate}
                            onChange={(e) => setInitialFinalDate(e)}
                            className={styles.dateRangePicker}
                            placeholder="Selecione uma data..."
                            locale={customLocale}
                        />
                    </div>

                    {/* <div style={{ gridColumn: 'span 2' }}>
                        <Label>Data de Início</Label>
                        <DatePicker
                            format="dd/MM/yyyy"
                            placeholder="Escolha uma data..."
                            value={initialDate}
                            onChange={(value) => setInitialDate(value)}
                            className={styles.dateInput}
                        />
                    </div> */}

                    {/* <div style={{ gridColumn: 'span 2' }}>
                        <Label>Data de Fim</Label>
                        <DatePicker
                            format="dd/MM/yyyy"
                            placeholder="Escolha uma data..."
                            value={finalDate}
                            onChange={(value) => setFinalDate(value)}
                            className={styles.dateInput}
                        />
                    </div> */}
                </div>
                <div className={styles.containerButton}>
                    <ButtonToolbar>
                        <Button appearance="primary" type="submit" color="violet" startIcon={<TagFilterIcon />} onClick={handleFilterData}>
                            Filtrar
                        </Button>
                        <Button appearance="primary" type="submit" color="cyan" startIcon={<CloseIcon />} onClick={handleClearFilters}>
                            Limpar Filtros
                        </Button>
                    </ButtonToolbar>
                </div>
                <Divider>Aulas</Divider>
                <div className={styles.tableContainer}>
                    <Table
                        height={350}
                        data={presenceList}
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={loading}
                    >

                        {/* Coluna para exibir o nome do aluno */}
                        <Column flexGrow={1} align="center">
                            <HeaderCell>Aluno</HeaderCell>
                            <Cell dataKey="student">
                                {(rowData: Presence) => rowData.student.name}
                            </Cell>
                        </Column>

                        {/* Coluna para exibir o nome do professor */}
                        <Column flexGrow={1} align="center">
                            <HeaderCell>Professor</HeaderCell>
                            <Cell dataKey="teacher">
                                {(rowData: Presence) => rowData.teacher.name}
                            </Cell>
                        </Column>

                        {/* Coluna para exibir a quantidade de aulas */}
                        <Column flexGrow={1} align="center" sortable>
                            <HeaderCell>Quantidade de Aulas</HeaderCell>
                            <Cell dataKey="quantityOfClasses">
                                {(rowData: Presence) => rowData.quantityOfClasses}
                            </Cell>
                        </Column>

                        {/* Coluna para exibir a data de início da aula */}
                        <Column flexGrow={1} align="center" sortable>
                            <HeaderCell>Início Aula</HeaderCell>
                            <Cell dataKey="startsAt">
                                {(rowData: Presence) => dayjs(rowData.startsAt).add(3, 'hour').format("DD/MM/YYYY HH:mm:ss")}
                            </Cell>
                        </Column>

                        {/* Coluna para exibir a data de término da aula */}
                        <Column flexGrow={1} align="center" sortable>
                            <HeaderCell>Fim Aula</HeaderCell>
                            <Cell dataKey="endsAt">
                                {(rowData: Presence) => dayjs(rowData.endsAt).add(3, 'hour').format("DD/MM/YYYY HH:mm:ss")}
                            </Cell>
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
        const teachers = await api.get("/teachers");
        const presences = await api.get("/presence");

        return {
            props: {
                students: students.data,
                teachers: teachers.data,
                presences: presences.data
            }
        }
    } catch (error) {
        console.log("Erro ao buscar dados ::::>> ", error)
        return {
            props: {
                students: [],
                teachers: [],
                presences: []
            }
        }
    }
})
