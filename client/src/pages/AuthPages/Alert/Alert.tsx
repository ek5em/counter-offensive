import React, { useContext, useEffect, useState } from "react";
import { MediatorContext } from "../../../App";
import cn from "classnames";

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

    const mediator = useContext(MediatorContext);
    const { WARNING } = mediator.getTriggerTypes();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        mediator.set(WARNING, (warning: IAlert) => {
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
