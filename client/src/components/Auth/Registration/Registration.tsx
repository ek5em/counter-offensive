import React, { useContext, useState } from "react";
import { ServerContext } from "../../../App";
import { Button, Input } from "../../UI";
import { ISetPage, IUserData } from "../../../interfaces";
import "../../../pages/RegistrationPage/RegistrationPage.css";

const Registration: React.FC<ISetPage> = ({ setPage }) => {
   const [userData, setUserData] = useState<IUserData>({
      login: "",
      password: "",
      nickName: "",
   });

   const server = useContext(ServerContext);

   const onChangeHandler = (value: string, data: string) => {
      setUserData({ ...userData, [data]: value });
   };

   const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      //условие валидации
      if (true) {
         const res = await server.registration(
            userData.login,
            userData.password
         );
         if (res) {
            setPage("Lobby");
         }
         return;
      }
      //обработка ошибок
   };

   return (
      <form className="reg_form" onSubmit={onSubmitHandler}>
         <div>
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
               type="hidePassword"
               value={userData.password}
               onChange={(value) => {
                  onChangeHandler(value, "password");
               }}
            />
         </div>
         <div className="errors_div">
            <div className="warning">
               <span>Заполните все поля</span>
            </div>
            <div className="warning">
               <span>В логине должно быть от 6 до 15 символов</span>
            </div>
            <div className="warning">
               <span>В пароле должно быть от 8 до 200 символов</span>
            </div>
            <div className="error">
               <span>Логин занят</span>
            </div>
            <div className="warning">
               <span>Пароли не совпадают</span>
            </div>
         </div>
         <div className="reg_footer">
            <Button
               appearance="primary"
               className="reg_submit_button"
               id="test_reg_submit_button"
            >
               Попасть в списки военных
            </Button>
         </div>
      </form>
   );
};

export default Registration;
