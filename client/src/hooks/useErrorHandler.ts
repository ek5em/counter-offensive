import { useNavigate } from "react-router-dom";
import { IError } from "../modules/Server/interfaces";
import { useGlobalContext } from "./useGlobalContext";

export const useErrorHandler = () => {
    const { mediator } = useGlobalContext();

    const navigate = useNavigate();
    const { SERVER_ERROR, WARNING, AUTH_ERROR, ROLE_ERROR } =
        mediator.getEventTypes();
    return () => {
        mediator.subscribe(SERVER_ERROR, (error: IError) => {
            switch (error.code) {
                case 234: {
                    return mediator.call(ROLE_ERROR, {
                        message: "Не дослужился, щенок!",
                        id: "test_message_not_enought_level",
                    });
                }
                case 235: {
                    return mediator.call(ROLE_ERROR, {
                        message: "Не мешай отцу играть!",
                        id: "test_message_level_less_than_current_general",
                    });
                }
                case 237: {
                    return mediator.call(ROLE_ERROR, {
                        message: "Занято!",
                        id: "test_message_place_occupied",
                    });
                }
                case 401: {
                    return mediator.call(AUTH_ERROR, null);
                }
                case 403: {
                    return mediator.call(WARNING, {
                        message: "Неверный логин или пароль",
                        id: "test_error_auth_wrongData",
                    });
                }
                case 413: {
                    return mediator.call(WARNING, {
                        message: "Неверный никнейм",
                        id: "test_error_auth_invalid_nickname",
                    });
                }
                case 422: {
                    return console.warn(`Ошибка ${error.code} ${error.text}`);
                }
                case 460: {
                    return mediator.call(WARNING, {
                        message: "Логин занят",
                        id: "test_error_reg_loginOccupied",
                    });
                }
                case 461: {
                    return mediator.call(WARNING, {
                        message: "Пользователя с таким логином не существует",
                        id: "test_error_auth_userNotExist",
                    });
                }

                default: {
                    return navigate("/error", { state: { error } });
                }
            }
        });
    };
};
