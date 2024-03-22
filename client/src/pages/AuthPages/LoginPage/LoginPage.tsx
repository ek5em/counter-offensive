import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import useLoginValidator from "./useLoginValidator";
import { MediatorContext, ServerContext } from "../../../App";
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

const LoginPage: React.FC = () => {
    const [userData, setUserData] = useState<IUserData>({
        login: "",
        password: "",
    });
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);

    const validate = useLoginValidator(mediator, server);

    const { LOGIN } = mediator.getTriggerTypes();

    const onChangeHandler = (value: string, data: string) => {
        setUserData({ ...userData, [data]: value });
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const login = userData.login.trim();
        const pass = userData.password.trim();
        const res = await validate(login, pass);
        if (res) {
            mediator.get(LOGIN, res);
        }
    };

    return (
        <div className={styles.authPage}>
            <Logo />
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <Link to="/registration" tabIndex={-1}>
                            <Button
                                appearance={EButtonAppearance.dark}
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

export default LoginPage;
