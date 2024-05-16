import { FC } from "react";
import cn from "classnames";

import styles from "./Button.module.scss";

export enum EButtonAppearance {
    primary = "primary",
    secondary = "secondary",
    dark = "dark",
}

export interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    appearance: EButtonAppearance;
}

export const Button: FC<ButtonProps> = ({
    appearance,
    className,
    children,
    id,
    ...props
}) => {
    return (
        <button
            id={id}
            className={cn(styles.button, className, [styles[appearance]])}
            {...props}
        >
            {children}
        </button>
    );
};
