import { FC, HTMLAttributes } from "react";
import cn from "classnames";

import styles from "./UnitButton.module.scss";

interface IUnitButton extends HTMLAttributes<HTMLButtonElement> {
    src: string;
    role: string;
}

export const UnitButton: FC<IUnitButton> = ({
    src,
    role,
    className,
    ...props
}) => {
    return (
        <button className={cn(styles.unit, className)} {...props}>
            <div className={styles.rank}>
                <p>{role}</p>
            </div>
            <div className={styles.imgWrapper}>
                <img src={src} alt={role} />
            </div>
        </button>
    );
};
