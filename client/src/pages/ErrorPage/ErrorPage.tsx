import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, EButtonAppearance } from "../../components";
import { IError } from "../../modules/Server/interfaces";

import styles from "./ErrorPage.module.scss";

const ErrorPage: FC = () => {
    const { state }: { state: { error: IError } | null } = useLocation();
    const error = state?.error ?? { code: 404, text: "Страница не найдена" };
    console.log(state, error);

    return (
        <div className={styles.wrapper}>
            <div className={styles.error}>
                <div className={styles.code}>
                    <h1>Ошибка №{error.code}</h1>
                </div>
                <div className={styles.text}>
                    <p>{error.text}</p>
                </div>
            </div>
            <Link to={"/"} tabIndex={-1}>
                <Button
                    className={styles.back}
                    appearance={EButtonAppearance.primary}
                >
                    На главную
                </Button>
            </Link>
        </div>
    );
};

export default ErrorPage;
