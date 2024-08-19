import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Nav } from "rsuite";
import CogIcon from '@rsuite/icons/legacy/Cog';

export function Header() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Navbar>
            <Navbar.Brand as={Link} href="/dashboard">
                MSC-Front
            </Navbar.Brand>

            <Nav>
                <Nav.Item as={Link} href="/dashboard">
                    Home
                </Nav.Item>
                <Nav.Item as={Link} href="/presences">
                    Presença
                </Nav.Item>
                <Nav.Menu title="Cadastros">
                    <Nav.Item as={Link} href="/student">
                        Aluno
                    </Nav.Item>

                    <Nav.Item as={Link} href="/teacher">
                        Professor
                    </Nav.Item>
                </Nav.Menu>
            </Nav>

            <Nav pullRight>
                <Nav.Item icon={<CogIcon />}>Configurações</Nav.Item>
            </Nav>
        </Navbar>
    );
}
