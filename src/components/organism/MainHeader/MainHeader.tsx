import { Plane } from "lucide-react";
import Button from "@/components/atoms/Button";
import s from "./MainHeader.module.css";

const MainHeader = () => {
  return (
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
  );
};

export default MainHeader;
