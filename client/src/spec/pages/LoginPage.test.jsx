import { screen, render, fireEvent } from "@testing-library/react";
import { LoginPage } from "../../pages/AuthPages/LoginPage/LoginPage";
import { MOCK } from "../../modules/Server/mock";
import { ContextProvider } from "../../components";

describe("Страничка авторизации", () => {
    const getLoginInput = () => screen.getByPlaceholderText(/логин/i);
    const getPasswordInput = () => screen.getByPlaceholderText(/пароль/i);
    const getSubmitBtn = () =>
        screen.getByRole("button", { name: /пойти на бахмут/i });
    const getNavBtn = () =>
        screen.getByRole("button", { name: /получить повестку/i });

    const createFields = ({
        login = "11111111",
        password = "11111111",
    } = {}) => {
        render(
            <ContextProvider useMock={true}>
                <LoginPage />
            </ContextProvider>
        );

        fireEvent.change(getLoginInput(), { target: { value: login } });
        fireEvent.change(getPasswordInput(), { target: { value: password } });
        fireEvent.click(getSubmitBtn());
    };

    test("Наличие всех элементов", () => {
        const {asFragment} = render(
            <ContextProvider>
                <LoginPage />
            </ContextProvider>
        );
        expect(getLoginInput()).toBeInTheDocument();
        expect(getPasswordInput()).toBeInTheDocument();
        expect(getSubmitBtn()).toBeInTheDocument();
        expect(getNavBtn()).toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot();
    });

    test("Пустой логин", () => {
        createFields({ login: "" });
        expect(screen.getByText(/Заполните все поля/i)).toBeInTheDocument();
    });

    test("Пустой пароль", () => {
        createFields({ password: "" });
        expect(screen.getByText(/Заполните все поля/i)).toBeInTheDocument();
    });

    test("Пустой пароль и логин", () => {
        createFields({ password: "", login: "" });
        expect(screen.getByText(/Заполните все поля/i)).toBeInTheDocument();
    });

    test("Неверный логин", () => {
        createFields();
        expect(
            screen.getByText(/Неверный логин или пароль/i)
        ).toBeInTheDocument();
    });

    test("Верные данные", () => {
        createFields({ ...MOCK.users[0] });
        expect(
            screen.queryByText(/Неверный логин или пароль/i)
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(/Заполните все поля/i)
        ).not.toBeInTheDocument();
    });
});
