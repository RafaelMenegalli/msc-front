import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Nav } from "rsuite";
import CogIcon from '@rsuite/icons/legacy/Cog';

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
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
                <Nav.Item icon={<CogIcon />}>Configurações</Nav.Item>
            </Nav>
        </Navbar>
    );
}
