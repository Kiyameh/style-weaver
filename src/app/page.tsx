"use client";

import { Code, Code2, Eye, LayoutDashboard, Palette } from "lucide-react";
import { useState } from "react";
import CodeBoxHeader from "@/components/organism/CssCodeBox/CodeBoxHeader";
import CssCodeBox from "@/components/organism/CssCodeBox/CssCodeBox";
import SidebarContent from "@/components/organism/SidebarContent/SidebarContent";
import s from "./page.module.css";

type ActiveView = "sidebar" | "code" | "preview";

export default function CssPreviewPage() {
  const [previewColors, setPreviewColors] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ActiveView>("code");

  return (
    <div className={s.container}>
      <div className={s.content}>
        <aside
          className={`${s.sidebar} ${activeView === "sidebar" ? s.active : ""}`}
        >
          <SidebarContent />
        </aside>
        <main className={s.main}>
          {/* Tabs for intermediate view (top) */}
          <nav className={s.tabsIntermediate}>
            <button
              type="button"
              className={`${s.tabButton} ${activeView === "code" ? s.active : ""}`}
              onClick={() => setActiveView("code")}
            >
              <Code2 size={20} aria-hidden="true" />
              CSS Code
            </button>
            <button
              type="button"
              className={`${s.tabButton} ${activeView === "preview" ? s.active : ""}`}
              onClick={() => setActiveView("preview")}
            >
              <LayoutDashboard size={20} aria-hidden="true" />
              Preview
            </button>
          </nav>
          <div
            className={`${s.cssCode} ${activeView === "code" ? s.active : ""}`}
          >
            <CodeBoxHeader
              previewColors={previewColors}
              setPreviewColors={setPreviewColors}
            />
            <CssCodeBox previewColors={previewColors} />

            {/* <OklchDisclaimer />
             */}
          </div>
          <div
            className={`${s.previewBox} ${activeView === "preview" ? s.active : ""}`}
          >
            <h2>PreviewBox</h2>
          </div>
        </main>
      </div>

      {/* Tabs for mobile view (bottom) */}
      <nav className={s.tabsMobile} aria-label="Navegación móvil">
        <button
          type="button"
          className={`${s.tabButtonMobile} ${activeView === "sidebar" ? s.active : ""}`}
          onClick={() => setActiveView("sidebar")}
          aria-label="Ver tema"
          aria-pressed={activeView === "sidebar"}
        >
          <Palette size={24} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${s.tabButtonMobile} ${activeView === "code" ? s.active : ""}`}
          onClick={() => setActiveView("code")}
          aria-label="Ver código CSS"
          aria-pressed={activeView === "code"}
        >
          <Code size={24} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${s.tabButtonMobile} ${activeView === "preview" ? s.active : ""}`}
          onClick={() => setActiveView("preview")}
          aria-label="Ver preview"
          aria-pressed={activeView === "preview"}
        >
          <Eye size={24} aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
