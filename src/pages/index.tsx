import styles from "@/styles/Home.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";

//Futura página de login

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return null;
}
