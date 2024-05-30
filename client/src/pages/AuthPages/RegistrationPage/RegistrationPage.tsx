import { FC, useState } from "react";
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

export const RegistrationPage: FC = () => {
    const [userData, setUserData] = useState<IUserData>({
        login: "",
        password: "",
        nickName: "",
    });
    const { server, mediator } = useGlobalContext();

    const { WARNING } = mediator.getEventTypes();

    const isPasswordValid = (pass: string) => {
        const passLength = pass.length;
        if (passLength < 8 || passLength > 20) {
            mediator.call(WARNING, {
                message: "В пароле должно быть от 8 до 20 символов",
                style: "warning",
                id: "test_warning_reg_password_length",
            });
            return false;
        }
        return true;
    };

    const isLoginValid = (login: string) => {
        const loginLength = login.length;
        if (loginLength < 6 || loginLength > 15) {
            mediator.call(WARNING, {
                message: "Логин должен содержать от 6 до 15 символов",
                style: "warning",
                id: "test_warning_reg_login_length",
            });
            return false;
        }
        const validLoginRegExp = /^[a-zA-Zа-яА-Я0-9Ёё]*$/;
        if (!validLoginRegExp.test(login)) {
            mediator.call(WARNING, {
                message:
                    "Логин может содержать символы кириллицы, латиницы и цифры",
                style: "warning",
                id: "test_warning_reg_acceptableSymbolsLogin",
            });
            return false;
        }
        return true;
    };

    const isNicknameValid = (nick: string) => {
        const nickLength = nick.length;
        if (nickLength < 3 || nickLength > 16) {
            mediator.call(WARNING, {
                message: "Никнейм должен содержать от 3 до 16 символов",
                style: "warning",
                id: "test_warning_reg_nickname_length",
            });
            return false;
        }
        const validNickRegExp = /^[0-9\p{L}]+$/u;
        if (!validNickRegExp.test(nick)) {
            mediator.call(WARNING, {
                message: "Никнейм может содержать символы любого языка и цифры",
                style: "warning",
                id: "test_warning_reg_acceptableSymbolsNickname",
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
        const nick = userData.nickName?.trim() ?? "";
        if (
            isLoginValid(login) &&
            isNicknameValid(nick) &&
            isPasswordValid(pass)
        ) {
            server.registration(login, nick, pass);
        }
    };

    return (
        <div className={styles.authPage}>
            <Logo />
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <div className={styles.title} id="test_auth_reg_title">
                        <Link to="/authorization" tabIndex={-1}>
                            <Button
                                appearance={EButtonAppearance.primary}
                                className="auth_switch_page"
                                id="test_login_go_log_button"
                            >
                                Уже служил
                            </Button>
                        </Link>
                    </div>
                    <form className={styles.form} onSubmit={onSubmitHandler}>
                        <div className={styles.values}>
                            <Input
                                text="Логин"
                                id="test_reg_log_input"
                                value={userData.login}
                                onChange={(value) => {
                                    onChangeHandler(value, "login");
                                }}
                            />
                            <Input
                                text="Никнейм"
                                id="test_reg_nick_input"
                                value={userData.nickName ?? ""}
                                onChange={(value) => {
                                    onChangeHandler(value, "nickName");
                                }}
                            />
                            <Input
                                text="Пароль"
                                id="test_reg_pass_input"
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
                            id="test_reg_submit_button"
                        >
                            Подписать повестку
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
