import { FC } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import SmallLogo from "./LogoSmall.png";
import LargeLogo from "./Logo.png";

import styles from "./Logo.module.scss";

export enum ELogo {
    small,
    large,
}

interface ILogo {
    size?: ELogo;
    className?: string;
}

export const Logo: FC<ILogo> = ({ size = ELogo.large, className }) => {
    return (
        <div className={cn(styles.logo, className)}>
            <Link to="/">
                <img
                    src={size === ELogo.large ? LargeLogo : SmallLogo}
                    alt="counter-nastup"
                />
            </Link>
        </div>
    );
};
