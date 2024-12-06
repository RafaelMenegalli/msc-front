import "@/styles/globals.css";
import 'rsuite/dist/rsuite.min.css';
import type { AppProps } from "next/app";
import { CustomProvider } from "rsuite";
import { AuthProvider } from "@/contexts/AuthContext";
import { SideNav } from "@/components/SideNav";
import { TopBar } from "@/components/TopBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CustomProvider>
      <AuthProvider>
        <div style={{ display: 'flex', width: '100%' }}>
          <SideNav />
          <div style={{ width: '100%' }}>
            <TopBar />
            <Component {...pageProps} />
          </div>
        </div>
      </AuthProvider>
    </CustomProvider>
  )
}
