import styles from "@/styles/Home.module.scss";
import { Input, InputGroup, Button, ButtonToolbar, Panel, toaster, Notification } from 'rsuite';
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthContext";
import { canSSTGuest } from "@/utils/canSSRGuest";

const Label = (props: any) => {
  return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleChange = () => {
    setVisible(!visible);
  };

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    if (!email || !password) {
      toaster.push(
        <Notification type="warning" header="Aviso!">
          Preencha o campo de email e senha para logar!
        </Notification>, { duration: 3500, placement: 'bottomEnd' }
      )

      setLoading(false)

      return
    }

    let data = {
      email, password
    }

    await signIn(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Página de Login</title>
      </Head>
      <div className={styles.container}>
        <Panel shaded bordered bodyFill className={styles.containerCard}>
          <form className={styles.form} onSubmit={handleLogin}>
            <InputGroup>
              <InputGroup.Addon>
                <AvatarIcon />
              </InputGroup.Addon>
              <Input
                type="email"
                placeholder="Digite seu email..."
                value={email}
                onChange={(value) => setEmail(value)}
              />
            </InputGroup>
            <InputGroup inside>
              <Input
                type={visible ? 'text' : 'password'}
                placeholder="Digite sua senha..."
                value={password}
                onChange={(value) => setPassword(value)}
              />
              <InputGroup.Button onClick={handleChange}>
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </InputGroup.Button>
            </InputGroup>
            <ButtonToolbar>
              <Button appearance="primary" className={styles.submitButton} type="submit" loading={loading}>Entrar</Button>
            </ButtonToolbar>
          </form>
        </Panel>
      </div>
    </>
  )
}

export const getServerSideProps = canSSTGuest(async (ctx) => {
  return {
    props: {}
  }
})