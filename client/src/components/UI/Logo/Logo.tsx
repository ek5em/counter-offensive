import { FC } from "react";
import LogoSRC from "./Logo.png";

import styles from "./Logo.module.scss";

export const Logo: FC = () => {
    return (
        <div className={styles.logo}>
            <img src={LogoSRC} alt="counter-nastup" />
        </div>
    );
};
