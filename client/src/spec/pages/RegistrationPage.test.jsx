import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {
    ContextProvider,
    MediatorContext,
    ServerContext,
} from "../../components";
import { MOCK } from "../../modules/Server/mock";
import { Mediator, Server } from "../../modules";
import { MEDIATOR, HOST } from "../../config";
import { RegistrationPage } from "../../pages/AuthPages/RegistrationPage/RegistrationPage";

describe("Страничка регистрации", () => {
    const getLoginInput = () => screen.getByPlaceholderText(/логин/i);
    const getNicknameInput = () => screen.getByPlaceholderText(/никнейм/i);
    const getPasswordInput = () => screen.getByPlaceholderText(/пароль/i);
    const getSubmitBtn = () =>
        screen.getByRole("button", { name: /подписать повестку/i });
    const getNavBtn = () => screen.getByRole("button", { name: /уже служил/i });

    const createFields = ({
        login = "11111111",
        password = "11111111",
        nickname = "superJaba123",
    } = {}) => {
        render(
            <ContextProvider useMock={true}>
                <RegistrationPage />
            </ContextProvider>
        );

        fireEvent.change(getLoginInput(), { target: { value: login } });
        fireEvent.change(getPasswordInput(), { target: { value: password } });
        fireEvent.change(getNicknameInput(), { target: { value: nickname } });
        fireEvent.click(getSubmitBtn());
    };

    test("Наличиие всех элементов", () => {
        const { asFragment } = render(
            <ContextProvider>
                <RegistrationPage />
            </ContextProvider>
        );
        expect(getLoginInput()).toBeInTheDocument();
        expect(getNicknameInput()).toBeInTheDocument();
        expect(getPasswordInput()).toBeInTheDocument();
        expect(getSubmitBtn()).toBeInTheDocument();
        expect(getNavBtn()).toBeInTheDocument();
        
        expect(asFragment()).toMatchSnapshot();
    });

    test("Логин меньше 6 символов", () => {
        createFields({ login: "a" });
        expect(
            screen.getByText(/Логин должен содержать от 6 до 15 символов/i)
        ).toBeInTheDocument();
    });

    test("Логин больше 15 символов", () => {
        createFields({ login: "1111111111111111" });
        expect(
            screen.getByText(/Логин должен содержать от 6 до 15 символов/i)
        ).toBeInTheDocument();
    });

    test("Неверные символы логин", () => {
        createFields({ login: "abcdefg::" });
        expect(
            screen.getByText(
                /Логин может содержать символы кириллицы, латиницы и цифры/i
            )
        ).toBeInTheDocument();
    });

    test("Неверные символы других языков логин", () => {
        createFields({ login: "ざざざざざざざざ" });
        expect(
            screen.getByText(
                /Логин может содержать символы кириллицы, латиницы и цифры/i
            )
        ).toBeInTheDocument();
    });

    test("Логин занят", () => {
        createFields({ ...MOCK.users[0] });
        expect(screen.getByText(/Логин занят/i)).toBeInTheDocument();
    });

    test("Никнейм короче 3 символов", () => {
        createFields({ nickname: "a" });
        expect(
            screen.getByText(/Никнейм должен содержать от 3 до 16 символов/i)
        ).toBeInTheDocument();
    });

    test("Никнейм длиннее 16 символов", () => {
        createFields({ nickname: "111111111111111111" });
        expect(
            screen.getByText(/Никнейм должен содержать от 3 до 16 символов/i)
        ).toBeInTheDocument();
    });

    test("Никнейм содержит неверные символы", () => {
        createFields({ nickname: "asd:;" });
        expect(
            screen.getByText(
                /Никнейм может содержать символы любого языка и цифры/i
            )
        ).toBeInTheDocument();
    });

    test("Пароль меньше 8 символов", () => {
        createFields({ password: "aa" });
        expect(
            screen.getByText(/В пароле должно быть от 8 до 20 символов/i)
        ).toBeInTheDocument();
    });

    test("Пароль больше 20 символов", () => {
        createFields({ password: "aaaaaaaaaaaaaaaaaaaaaa" });
        expect(
            screen.getByText(/В пароле должно быть от 8 до 20 символов/i)
        ).toBeInTheDocument();
    });

    test("Верные данные", () => {
        createFields();
        expect(
            screen.queryByText(
                /Логин может содержать символы кириллицы, латиницы и цифры/i
            )
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(/Логин должен содержать от 6 до 15 символов/i)
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(/Никнейм должен содержать от 3 до 16 символов/i)
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                /Никнейм может содержать символы любого языка и цифры/i
            )
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(/В пароле должно быть от 8 до 20 символов/i)
        ).not.toBeInTheDocument();
    });

    /* test("Регистрация", () => {
        const mediator = new Mediator(MEDIATOR);
        const server = new Server(HOST, mediator, true);
        const registrationSpy = jest
            .spyOn(server, "registration")
            .mockImplementation(jest.fn());

        render(
            <BrowserRouter>
                <MediatorContext.Provider value={mediator}>
                    <ServerContext.Provider value={server}>
                        <RegistrationPage />
                    </ServerContext.Provider>
                </MediatorContext.Provider>
            </BrowserRouter>
        );
        // Ввод данных
        fireEvent.change(getLoginInput(), { value: login });
        fireEvent.change(getPasswordInput(), { value: password });
        fireEvent.change(getNicknameInput(), { value: nickname });

        fireEvent.click(getSubmitBtn());
        // expect(registrationSpy).toHaveBeenCalledWith(login, nickname, password);
        // expect(registrationSpy).toHaveBeenCalledTimes(1);
    }); */
});
