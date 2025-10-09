import type { Metadata } from "next";
import { Cascadia_Code, Outfit, Pacifico } from "next/font/google";
import "@/styles/global.css";
import "@/styles/theme.css";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useMemo } from "react";
import MainHeader from "@/components/organism/MainHeader/MainHeader";
import SidebarContent from "@/components/organism/SidebarContent/SidebarContent";
import s from "./layout.module.css";

/* Fonts */
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

/* Metadata */
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
        <MainHeader />
        {children}
      </body>
    </html>
  );
}
