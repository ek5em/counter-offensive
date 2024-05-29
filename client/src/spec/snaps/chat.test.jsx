import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Chat, ContextProvider, EChat } from "../../components";

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
});
