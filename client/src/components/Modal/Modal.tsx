import { FC, useEffect, useState } from "react";
import cn from "classnames";
import { useGlobalContext } from "../../hooks/useGlobalContext";

import styles from "./Modal.module.scss";

interface ModalError {
    id: string;
    message: string;
}

const clearDelay = 4000;

export const Modal: FC = () => {
    const [message, setMessage] = useState<ModalError>({
        message: "",
        id: "",
    });

    const { mediator } = useGlobalContext();

    const { ROLE_ERROR } = mediator.getEventTypes();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        mediator.subscribe(ROLE_ERROR, (newMessaage: ModalError) => {
            setMessage(newMessaage);

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                clearMessage();
            }, clearDelay);
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
