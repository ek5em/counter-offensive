import { FC } from "react";
import { Button, EButtonAppearance, Logo } from "../../components";

import styles from "./MenuPage.module.scss";

const MenuPage: FC = () => {
    return (
        <div className={styles.menu}>
            <Logo />
            <div className={styles.btns}>
                <Button
                    appearance={EButtonAppearance.menu}
                    id="test_menu_goToLobby_button"
                >
                    <p className={styles.l}>Вернуться на службу</p>
                    <p className={styles.s}>Вернуться в лобби</p>
                </Button>
                <Button
                    appearance={EButtonAppearance.menu}
                    id="test_menu_goToMain_button"
                >
                    <p className={styles.l}>Дембельнуться</p>
                    <p className={styles.s}>Выйти из аккаунта</p>
                </Button>
            </div>
        </div>
    );
};

export default MenuPage;
