import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Chat, ContextProvider, EChat } from "../../components";
import { MOCK } from "../../modules/Server/mock";
import { Mediator, Server } from "../../modules";
import { MEDIATOR, HOST } from "../../config";
import { MediatorContext, ServerContext } from "../../components";

window.HTMLElement.prototype.scrollIntoView = function () {};

describe("Chat component", () => {
    const ChatTestWrapper = ({ initialIsOpen }) => {
        const [isOpen, setIsOpen] = useState(initialIsOpen);
        return (
            <Chat
                chatType={EChat.lobby}
                isOpen={isOpen}
                setIsOpen={() => setIsOpen(!isOpen)}
            />
        );
    };

    test("Открытие чата", () => {
        render(
            <ContextProvider>
                <ChatTestWrapper initialIsOpen={false} />
            </ContextProvider>
        );
        const openButton = screen.getByTestId("chat-opener");
        expect(openButton).toBeInTheDocument();
        fireEvent.click(openButton);
        const closeButton = screen.getByTestId("chat-closer");
        expect(closeButton).toBeInTheDocument();
        expect(screen.getByTestId("chat-input")).toBeInTheDocument();
    });

    test("Закрытие чата", () => {
        render(
            <ContextProvider>
                <ChatTestWrapper initialIsOpen={true} />
            </ContextProvider>
        );
        const closeButton = screen.getByTestId("chat-closer");
        expect(closeButton).toBeInTheDocument();
        fireEvent.click(closeButton);
        const openButton = screen.getByTestId("chat-opener");
        expect(openButton).toBeInTheDocument();
    });

    test("Получение сообщений", () => {
        render(
            <ContextProvider useMock={true}>
                <ChatTestWrapper initialIsOpen={true} />
            </ContextProvider>
        );
        MOCK.messages.forEach((message) => {
            expect(screen.getByText(message.text)).toBeInTheDocument();
        });
    });

    test("Отправка сообщений", () => {
        const newMessage = "1233221";
        const mediator = new Mediator(MEDIATOR);
        const server = new Server(HOST, mediator, true);
        const component = render(
            <BrowserRouter>
                <MediatorContext.Provider value={mediator}>
                    <ServerContext.Provider value={server}>
                        <ChatTestWrapper initialIsOpen={true} />
                    </ServerContext.Provider>
                </MediatorContext.Provider>
            </BrowserRouter>
        );
        //авторизация
        const { login, password } = MOCK.users[0];
        server.login(login, password);
        const input = screen.getByPlaceholderText("Написать в чат");
        fireEvent.change(input, { target: { value: newMessage } });
        // Проверяем, что текст был успешно введен в инпут
        expect(input.value).toBe(newMessage);
        const button = screen.getByRole("button", { name: /send/i });
        fireEvent.click(button);
        expect(input.value).toBe("");
        expect(screen.getByText(newMessage));
        expect(component.asFragment()).toMatchSnapshot();
    });
});
