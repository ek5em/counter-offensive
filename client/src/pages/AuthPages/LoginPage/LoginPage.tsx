import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Alert, Logo } from "../../../components";
import { IUserData } from "../userData.interface";
import { MediatorContext, ServerContext } from "../../../App";

import "../AuthPage.css";
import useLoginValidator from "./useLoginValidator";

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
      <div className="auth_wrapper">
         <Logo />
         <div className="auth_title" id="test_auth_reg_title">
            Уже служил
         </div>
         <form className="auth_form" onSubmit={onSubmitHandler}>
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
            <div className="auth_footer">
               <Link to="/registration" tabIndex={-1}>
                  <Button
                     appearance="primary"
                     className="auth_switch_page"
                     id="test_login_go_reg_button"
                  >
                     Получить повестку
                  </Button>
               </Link>
               <Button
                  appearance="primary"
                  className="login_submit_button"
                  id="test_login_submit_button"
               >
                  Пойти на Бахмут
               </Button>
            </div>
         </form>
      </div>
   );
};

export default LoginPage;
