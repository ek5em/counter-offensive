import { FC, useEffect, useState } from "react";
import cn from "classnames";
import { useGlobalContext } from "../../hooks/useGlobalContext";

import styles from "./Modal.module.scss";

interface MoodalError {
    id: string;
    message: string;
}

export const Modal: FC = () => {
    const [message, setMessage] = useState<MoodalError>({
        message: "",
        id: "",
    });

    const {  mediator } = useGlobalContext();

    const { ROLE_ERROR } = mediator.getTriggerTypes();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        mediator.set(ROLE_ERROR, (newMessaage: MoodalError) => {
            setMessage(newMessaage);

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                clearMessage();
            }, 4000);
        });

        return () => {
            clearMessage();
        };
    }, []);

    const clearMessage = () => {
        setMessage({ message: "", id: "" });
    };
    return (
        <div
            className={cn(styles.modal, {
                disabled: !message.message,
            })}
            onClick={clearMessage}
        >
            <div className={styles.message} id={message.id}>
                {message.message}
            </div>
        </div>
    );
};
