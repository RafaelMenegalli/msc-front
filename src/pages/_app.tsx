import "@/styles/globals.css";
import 'rsuite/dist/rsuite.min.css';
import type { AppProps } from "next/app";
import { CustomProvider } from "rsuite";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CustomProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </CustomProvider>
  )
}
