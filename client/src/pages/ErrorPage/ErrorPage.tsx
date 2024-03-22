import { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, EButtonAppearance } from "../../components";
import { IError } from "../../modules/Server/interfaces";

import styles from "./ErrorPage.module.scss";

const ErrorPage: FC = () => {
    const navigate = useNavigate();
    const { state }: { state: { error: IError } | null } = useLocation();
    const error = state?.error ?? { code: 404, text: "Страница не найдена" };

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
