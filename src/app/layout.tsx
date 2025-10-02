import type { Metadata } from "next";
import { Cascadia_Code, Outfit, Pacifico } from "next/font/google";
import "@/styles/global.css";
import "@/styles/theme.css";
import { PanelRightClose, PanelRightOpen, Plane } from "lucide-react";
import { useMemo } from "react";
import Button from "@/components/atoms/Button";
import SidebarContent from "@/components/organism/SidebarContent/SidebarContent";
import s from "./layout.module.css";

const outfitSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
});

const cascadiaCode = Cascadia_Code({
  variable: "--font-cascadia",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StyleWeaver - Your styling bird",
  description: "A modern Tool for styling your website",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const className = useMemo(() => {
    return `${outfitSans.variable} ${pacifico.variable} ${cascadiaCode.variable}`;
  }, []);

  return (
    <html lang="es">
      <body className={className}>
        <header className={s.header}>
          <div className={s.logoContainer}>
            <img src="logo.svg" alt="Style Weaver" className={s.logo} />
            <h1>Style Weaver</h1>
          </div>
          <div className={s.banner}>
            <nav className={s.navContainer}>
              <Plane />
              <a href="https://kiyameh.com">Volver a Kiyameh.com</a>
            </nav>
            <div className={s.actionsContainer}>
              <Button>Library</Button>
              <Button variant="secondary">Login</Button>
              <Button variant="ghost">Register</Button>
            </div>
          </div>
        </header>
        <div className={s.container}>
          <input
            type="checkbox"
            id="sidebar-toggle"
            className={s.checkbox}
            defaultChecked
          />
          <aside className={s.sidebar}>
            <SidebarContent />
          </aside>
          <main className={s.main}>
            <label htmlFor="sidebar-toggle" className={s.label}>
              <PanelRightOpen size={26} className={s.open} />
              <PanelRightClose size={26} className={s.close} />
            </label>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
