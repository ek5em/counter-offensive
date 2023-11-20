import React, { useContext, useState } from "react";
import { Button, Input, Alert } from "../../UI";
import { IUserData } from "../../../interfaces";
import { MediatorContext, ServerContext } from "../../../App";

const Login: React.FC = () => {
  const [userData, setUserData] = useState<IUserData>({
    login: "",
    password: "",
  });

  const server = useContext(ServerContext);
  const mediator = useContext(MediatorContext);
  const { WARNING } = mediator.getTriggerTypes();

  const isValidInputs = async (
    login: string,
    pass: string
  ): Promise<boolean> => {
    if (!login || !pass) {
      mediator.get(WARNING, {
        message: "Заполните все поля",
        style: "warning",
        id: "test_warning_auth_emptyFields",
      });
      return false;
    }
    const logRes = await server.login(login, pass);
    if (!logRes) {
      setUserData({ ...userData, password: "" });
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
    if (await isValidInputs(login, pass)) {
      return;
    }
  };

  return (
    <form className="login_form" onSubmit={onSubmitHandler}>
      <div>
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
          type="password"
          value={userData.password}
          onChange={(value) => {
            onChangeHandler(value, "password");
          }}
        />
      </div>
      <div className="errors_div">
        <Alert />
      </div>
      <div className="login_footer">
        <Button
          appearance="primary"
          className="login_submit_button"
          id="test_login_submit_button"
        >
          Пойти на Бахмут
        </Button>
      </div>
    </form>
  );
};

export default Login;
