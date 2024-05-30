import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../hooks/useGlobalContext";
import { IUserData } from "../userData.interface";
import {
    Button,
    EButtonAppearance,
    EInput,
    Input,
    Logo,
} from "../../../components";
import { Alert } from "../Alert/Alert";

import styles from "../AuthPage.module.scss";

export const LoginPage: React.FC = () => {
    const [userData, setUserData] = useState<IUserData>({
        login: "",
        password: "",
    });
    const { server, mediator } = useGlobalContext();

    const { WARNING } = mediator.getEventTypes();

    const isValid = (login: string, password: string) => {
        if (!login || !password) {
            mediator.call(WARNING, {
                message: "Заполните все поля",
                style: "warning",
                id: "test_warning_auth_emptyFields",
            });
            return false;
        }
        return true;
    };

    const onChangeHandler = (value: string, data: string) => {
        setUserData({ ...userData, [data]: value });
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const login = userData.login.trim();
        const pass = userData.password.trim();
        isValid(login, pass) && server.login(login, pass);
    };

    return (
        <div className={styles.authPage}>
            <Logo />
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <Link to="/registration" tabIndex={-1}>
                            <Button
                                appearance={EButtonAppearance.primary}
                                id="test_login_goToReg_button"
                            >
                                Получить повестку
                            </Button>
                        </Link>
                    </div>
                    <form className={styles.form} onSubmit={onSubmitHandler}>
                        <div className={styles.values}>
                            <Input
                                text="Логин"
                                id="test_login_log_input"
                                value={userData.login}
                                onChange={(value) => {
                                    onChangeHandler(value, "login");
                                }}
                            />
                            <Input
                                text="Пароль"
                                id="test_login_pass_input"
                                type={EInput.password}
                                value={userData.password}
                                onChange={(value) => {
                                    onChangeHandler(value, "password");
                                }}
                            />
                        </div>
                        <Alert />
                        <Button
                            appearance={EButtonAppearance.primary}
                            className={styles.submit}
                            id="test_login_submit_button"
                        >
                            Пойти на Бахмут
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
