"use client";

import { useState } from "react";
import CodeBoxHeader from "@/components/organism/CssCodeBox/CodeBoxHeader";
import CssCodeBox from "@/components/organism/CssCodeBox/CssCodeBox";
import SidebarContent from "@/components/organism/SidebarContent/SidebarContent";
import s from "./page.module.css";

export default function CssPreviewPage() {
  const [previewColors, setPreviewColors] = useState<boolean>(true);

  return (
    <div className={s.container}>
      <aside className={s.sidebar}>
        <SidebarContent />
      </aside>
      <main className={s.main}>
        <div className={s.content}>
          <CodeBoxHeader
            previewColors={previewColors}
            setPreviewColors={setPreviewColors}
          />
          <CssCodeBox previewColors={previewColors} />
        </div>
      </main>
    </div>
  );
}
