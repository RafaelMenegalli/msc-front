import styles from "@/styles/Home.module.scss";
import { Input, InputGroup, Button, ButtonToolbar, Panel, toaster, Notification } from 'rsuite';
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { FormEvent, useState } from "react";
import Head from "next/head";
import { api } from "@/services/apiClient";
import { useRouter } from "next/router";

const Label = (props: any) => {
  return <label style={{ width: '100%', display: 'inline-block', paddingBottom: "0.2rem" }} {...props} />;
};

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter()

  const handleChange = () => {
    setVisible(!visible);
  };

  async function handleLogin(event: FormEvent) {
    event.preventDefault()

    if (!email || !password) {
      toaster.push(
        <Notification type="warning" header="Aviso!">
          Preencha o campo de email e senha para logar!
        </Notification>, { duration: 3500, placement: 'bottomEnd' }
      )

      return
    }

    try {
      await api.post("/auth/login", {
        email: email,
        password: password
      })

      toaster.push(
        <Notification type="success" header="Sucesso!">
          Login efetuado com sucesso!
        </Notification>, { duration: 3500, placement: 'bottomEnd' }
      )

      router.push('/dashboard')
    } catch (error) {
      console.log("Erro ao logar ::::>> ", error)
      toaster.push(
        <Notification type="error" header="Erro!">
          Email ou Senha Inválido!
        </Notification>, { duration: 3500, placement: 'bottomEnd' }
      )
    }

  }

  return (
    <>
      <Head>
        <title>Página de Login</title>
      </Head>
      <div className={styles.container}>
        <Panel shaded bordered bodyFill className={styles.containerCard}>
          <h1 className={styles.title}>Página de Login (Logo da Escola)</h1>
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
              <Button appearance="primary" className={styles.submitButton} type="submit">Entrar</Button>
            </ButtonToolbar>
          </form>
        </Panel>
      </div>
    </>
  )
}
