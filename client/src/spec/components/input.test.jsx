import { render, screen, fireEvent } from "@testing-library/react";
import { Input, EInput } from "../../components";

describe("Инпут", () => {
    const onChangeMock = jest.fn();
    test("Наличие импута", () => {
        render(<Input id="1" onChange={onChangeMock} text="input" />);
        expect(screen.getByPlaceholderText(/input/i)).toBeInTheDocument();
    });

    test("Скрытие пароля", () => {
        render(
            <Input
                id="1"
                text="Пароль"
                value=""
                onChange={onChangeMock}
                type={EInput.password}
            />
        );

        const inputElement = screen.getByPlaceholderText("Пароль");
        const closeEyeIcon = screen.getByTestId("close-eye-icon");
        expect(closeEyeIcon).toBeInTheDocument();
        expect(inputElement).toHaveAttribute("type", "password");

        fireEvent.click(closeEyeIcon);

        const openEyeIcon = screen.getByTestId("open-eye-icon");
        expect(inputElement).toHaveAttribute("type", "text");
        expect(openEyeIcon).toBeInTheDocument();

        fireEvent.click(openEyeIcon);

        expect(inputElement).toHaveAttribute("type", "password");
        expect(screen.getByTestId("close-eye-icon")).toBeInTheDocument();
    });

    test("Ввод данных", () => {
        const mockOnChange = jest.fn();
        const message1 = "text";
        const message2 = "password";

        // Рендерим компонент
        render(
            <>
                <Input
                    id="test-input-text"
                    text="text"
                    value=""
                    onChange={mockOnChange}
                    type={EInput.text}
                />
                <Input
                    id="test-input-password"
                    text="password"
                    value=""
                    onChange={mockOnChange}
                    type={EInput.password}
                />
            </>
        );

        fireEvent.change(screen.getByPlaceholderText(/text/i), {
            target: { value: message1 },
        });
        expect(mockOnChange).toHaveBeenCalledWith(message1);

        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: message2 },
        });
        expect(mockOnChange).toHaveBeenCalledWith(message2);
    });
    test("snapshot", () => {
        const mock = jest.fn();
        const { asFragment } = render(
            <>
                <Input
                    id="1"
                    onChange={mock}
                    text="hello"
                    value=""
                    type={EInput.password}
                />
                 <Input
                    id="2"
                    onChange={mock}
                    text="hello"
                    value=""
                    type={EInput.text}
                />
            </>
        );
    });
});
