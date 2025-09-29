import { Palette } from "lucide-react";
import s from "./Header.module.css";

const Header = () => {
  return (
    <header className={s.header}>
      <nav>
        <a href="https://kiyameh.com">Volver a Kiyameh.com</a>
      </nav>

      <h1>
        <Palette />
        Style Weaver</h1>
      <div>
        <p>Library</p>
        <p>User actions</p>
      </div>
    </header>
  );
};

export default Header;
