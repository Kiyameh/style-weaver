import { Plane } from "lucide-react";
import Button from "@/components/atoms/Button";
import s from "./MainHeader.module.css";

const MainHeader = () => {
  return (
    <header className={s.header}>
      <div className={s.logoContainer} role="img" aria-label="Logo container">
        <img src="logo.svg" alt="Style Weaver logo" className={s.logo} />
        <h1 className={s.title}>Style Weaver</h1>
      </div>

      <div className={s.banner}>
        <nav className={s.navContainer} aria-label="Navegación principal">
          <Plane aria-hidden="true" />
          <a
            href="https://kiyameh.com"
            className={s.backLink}
            aria-label="Volver al portfolio de Kiyameh"
          >
            Volver a Kiyameh.com
          </a>
        </nav>

        <div className={s.actionsContainer}>
          <Button aria-label="Ir a la biblioteca de componentes">
            Library
          </Button>
          <Button variant="secondary" aria-label="Iniciar sesión en tu cuenta">
            Login
          </Button>
          <Button variant="ghost" aria-label="Crear una nueva cuenta">
            Register
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;

// Named export for testing
export { MainHeader };
