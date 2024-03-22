import { FC, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MediatorContext, ServerContext } from "../../../App";
import useRegValidator from "./useRegValidator";
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

const RegistrationPage: FC = () => {
    const [userData, setUserData] = useState<IUserData>({
        login: "",
        password: "",
        nickName: "",
    });
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);

    const validator = useRegValidator(mediator, server);

    const { LOGIN } = mediator.getTriggerTypes();

    const onChangeHandler = (value: string, data: string) => {
        setUserData({ ...userData, [data]: value });
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const login = userData.login.trim();
        const pass = userData.password.trim();
        const nick = userData.nickName?.trim();
        const res = await validator(login, pass, nick ?? "");
        if (res) {
            mediator.get(LOGIN, res);
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

export default RegistrationPage;
