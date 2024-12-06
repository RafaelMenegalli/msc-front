import styles from "./styles.module.scss";
import Link from "next/link";
import MenuIcon from '@rsuite/icons/Menu';
import NoticeIcon from '@rsuite/icons/Notice';
import ExitIcon from '@rsuite/icons/Exit';
import AdminIcon from '@rsuite/icons/Admin';
import { Breadcrumb } from "rsuite";

export function TopBar() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <div className={styles.leftSide}>
                        <div className={styles.leftIcons}>
                            <MenuIcon style={{ fontSize: '1rem' }} className={styles.iconButton} />
                            <NoticeIcon style={{ fontSize: '1rem' }} className={styles.iconButton} />
                        </div>
                        <Breadcrumb className={styles.breadcrumb}>
                            <Breadcrumb.Item as={Link} href="/">Home</Breadcrumb.Item>
                            <Breadcrumb.Item as={Link} href="/components/overview">Components</Breadcrumb.Item>
                            <Breadcrumb.Item as={Link} active>Breadcrumb</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <span className={styles.pageNameText}><strong>Teste Rafael Menegalli</strong></span>

                    <div className={styles.rightSite}>
                        <AdminIcon style={{ fontSize: '1.3rem' }} className={styles.iconButton} />
                        <ExitIcon style={{ fontSize: '1.3rem' }} className={styles.iconButton} />
                    </div>
                </div>
            </div>
        </>
    )
}