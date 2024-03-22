import { FC } from "react";
import cn from "classnames";

import styles from "./Button.module.scss";

export enum EButtonAppearance {
    menu = "menu",
    primary = "primary",
    dark = "dark",
}

export interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    appearance: EButtonAppearance;
    active?: boolean;
}

export const Button: FC<ButtonProps> = ({
    appearance,
    className,
    children,
    active,
    id,
    ...props
}) => {
    return (
        <button
            id={id}
            className={cn(
                styles.button,
                [styles[appearance]],
                {
                    [styles.active]: active,
                },
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
