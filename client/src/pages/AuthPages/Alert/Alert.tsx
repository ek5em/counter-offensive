import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useGlobalContext } from "../../../hooks/useGlobalContext";

import styles from "./Alert.module.scss";

export enum EAlert {
    warning = "warning",
    error = "error",
    disabled = "disabled",
}

export interface IAlert {
    message: string;
    style: EAlert;
    id?: string;
}

export const Alert: React.FC = () => {
    const [alert, setAlert] = useState<IAlert>({
        message: "",
        style: EAlert.disabled,
        id: "",
    });

    const { mediator } = useGlobalContext();

    const { WARNING } = mediator.getEventTypes();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        mediator.subscribe(WARNING, (warning: IAlert) => {
            setAlert({ ...warning, style: warning.style ?? EAlert.error });

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                setAlert((prevAlert) => ({
                    ...prevAlert,
                    style: EAlert.disabled,
                }));
            }, 5000);
        });

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div
            className={cn(styles.alert, {
                [styles[alert.style]]: alert.style !== EAlert.disabled,
                disabled: alert.style === EAlert.disabled,
            })}
            id={alert.id}
        >
            <span>{alert.message}</span>
        </div>
    );
};
