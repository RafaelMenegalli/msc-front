import styles from "./styles.module.scss";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Nav, Button } from "rsuite";
import CogIcon from '@rsuite/icons/legacy/Cog';
import ExitIcon from '@rsuite/icons/Exit';
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import { AuthContext } from "@/contexts/AuthContext";

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    const { signOut } = useContext(AuthContext)

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Navbar className={styles.navBar}>
            <Nav>
                <Navbar.Brand as={Link} href="/dashboard">
                    MSC-Front
                </Navbar.Brand>

                <Nav>
                    <Nav.Item as={Link} href="/dashboard">
                        Home
                    </Nav.Item>
                    <Nav.Menu title="Controle de Aulas">
                        <Nav.Item as={Link} href="/presences">
                            Lançamento de Presença
                        </Nav.Item>
                        <Nav.Item as={Link} href="/history_presences">
                            Histórico de Presença
                        </Nav.Item>
                    </Nav.Menu>
                    <Nav.Menu title="Cadastros">
                        <Nav.Item as={Link} href="/student">
                            Aluno
                        </Nav.Item>

                        <Nav.Item as={Link} href="/teacher">
                            Professor
                        </Nav.Item>
                    </Nav.Menu>
                </Nav>
            </Nav>

            <span className={styles.title}>{title}</span>

            <Nav>
                <Nav.Menu title="Configurações">
                    <Nav.Item icon={<CogIcon />} as={Link} href="/settings">Configurações Gerais</Nav.Item>
                    {/* <Nav.Item icon={<UserBadgeIcon />} as={Link} href="/users">Usuários</Nav.Item> */}
                    <Nav.Item icon={<ExitIcon />} as={Button} onClick={signOut} className={styles.exitButton}>Sair</Nav.Item>
                </Nav.Menu>
            </Nav>
        </Navbar>
    );
}
