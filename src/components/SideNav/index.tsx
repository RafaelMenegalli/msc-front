import styles from "./styles.module.scss";
import { useState } from "react";
import Link from "next/link";
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import BarLineChartIcon from '@rsuite/icons/BarLineChart';
import EditIcon from '@rsuite/icons/Edit';
import CalendarIcon from '@rsuite/icons/Calendar';


export function SideNav() {
    const [expanded, setExpanded] = useState<boolean>(true);
    const [activeKey, setActiveKey] = useState<string>('1');

    return (
        <>
            <div style={{ width: 210 }}>
                <Sidenav expanded={expanded} style={{ height: '100vh' }}>
                    <Sidenav.Header className={styles.headerSidNav}>
                        <div className={styles.sideNavHeader}>Qlivo.</div>
                    </Sidenav.Header>
                    <Sidenav.Body>
                        <Nav activeKey={activeKey} onSelect={setActiveKey}>
                            <Nav.Item eventKey="1" icon={<DashboardIcon />} as={Link} href="/dashboard">
                                Dashboard
                            </Nav.Item>
                            <Nav.Menu placement="rightStart" eventKey="2" title="Cadastros" icon={<EditIcon />}>
                                <Nav.Item eventKey="2-1" as={Link} href="/student" >Aluno</Nav.Item>
                                <Nav.Item eventKey="2-2" as={Link} href="/teacher" >Professor</Nav.Item>
                            </Nav.Menu>
                            <Nav.Menu placement="rightStart" eventKey="3" title="Financeiro" icon={<BarLineChartIcon />}>
                                <Nav.Item eventKey="3-1" as={Link} href="/account_payable" >Contas a Pagar</Nav.Item>
                                <Nav.Item eventKey="3-2" as={Link} href="/account_receivable" >Contas a Receber</Nav.Item>
                            </Nav.Menu>
                            <Nav.Menu placement="rightStart" eventKey="4" title="Controle d..." icon={<CalendarIcon />}>
                                <Nav.Item eventKey="4-1" as={Link} href="/presences" >Lançamento de Presença</Nav.Item>
                                <Nav.Item eventKey="4-2" as={Link} href="/history_presences" >Histórico de Presenças</Nav.Item>
                            </Nav.Menu>
                            {/* <Nav.Menu
                                placement="rightStart"
                                eventKey="4"
                                title="Settings"
                                icon={<GearCircleIcon />}
                            >
                                <Nav.Item eventKey="4-1">Applications</Nav.Item>
                                <Nav.Item eventKey="4-2">Channels</Nav.Item>
                                <Nav.Item eventKey="4-3">Versions</Nav.Item>
                                <Nav.Menu eventKey="4-5" title="Custom Action">
                                    <Nav.Item eventKey="4-5-1">Action Name</Nav.Item>
                                    <Nav.Item eventKey="4-5-2">Action Params</Nav.Item>
                                </Nav.Menu>
                            </Nav.Menu> */}
                        </Nav>
                    </Sidenav.Body>
                    {/* <Sidenav.Toggle onToggle={expanded => setExpanded(expanded)} /> */}
                </Sidenav>
            </div>
        </>
    )
}