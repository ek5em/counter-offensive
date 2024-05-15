import {
    forwardRef,
    useEffect,
    useRef,
    useState,
    HTMLAttributes,
    DetailedHTMLProps,
} from "react";
import cn from "classnames";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { IGamerInfo, IMessage } from "../../modules/Server/interfaces";
import { getRankImg } from "../../helpers";
import { sendMessage, chatIcon } from "./assets";
import { closeIcon } from "../../assets/png";

import styles from "./Chat.module.scss";

export enum EChat {
    lobby = "lobby",
    game = "game",
}

interface IChatProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    chatType: EChat;
    isOpen: boolean;
    setIsOpen: () => void;
}

export const Chat = forwardRef<HTMLInputElement | null, IChatProps>(
    ({ chatType, isOpen, setIsOpen }, ref) => {
        const { server, mediator } = useGlobalContext();

        const [messages, setMessages] = useState<IMessage[]>([]);
        const [inputText, setInputText] = useState<string>("");

        const messagesEndRef = useRef<null | HTMLDivElement>(null);

        const { NEW_MESSAGE, SEND_MESSAGE_STATUS } = mediator.getEventTypes();

        const user = server.STORE.getUser();

        useEffect(() => {
            mediator.subscribe(NEW_MESSAGE, (newMessages: IMessage[]) => {
                setMessages(newMessages);
            });

            mediator.subscribe(SEND_MESSAGE_STATUS, (status: true | null) => {
                console.log(status);
                if (status) {
                    setInputText("");
                    scrollToBottom();
                }
            });

            server.getMessages();
        }, []);

        useEffect(() => {
            scrollToBottom();
        }, [isOpen]);

        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        const handleInputChange = (
            event: React.ChangeEvent<HTMLInputElement>
        ) => {
            setInputText(event.target.value);
        };

        const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const message = inputText.trim();
            if (chatType && message) {
                server.sendMessage(message);
            }
        };

        return (
            <>
                {isOpen ? (
                    <div className={cn(styles[chatType], styles.chat)}>
                        <div className={styles.title}>
                            <span>Чат</span>
                            <img
                                src={closeIcon}
                                className={styles.close}
                                onClick={setIsOpen}
                            />
                        </div>
                        <div>
                            <div className={styles.messages}>
                                {messages.length ? (
                                    <>
                                        {[...messages]
                                            .reverse()
                                            .map((message, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        styles.message,
                                                        {
                                                            [styles.myMessge]:
                                                                user?.id ===
                                                                message.userId,
                                                        }
                                                    )}
                                                >
                                                    <span
                                                        className={styles.name}
                                                    >
                                                        [{message.nickname}
                                                        <img
                                                            src={getRankImg(
                                                                message.rank_name
                                                            )}
                                                            alt="rank"
                                                            className={
                                                                styles.rank_img
                                                            }
                                                        />
                                                        ]
                                                    </span>
                                                    : {}
                                                    <span
                                                        className={
                                                            styles.message_text
                                                        }
                                                    >
                                                        {message.text}
                                                    </span>
                                                </div>
                                            ))}
                                        <div ref={messagesEndRef} />
                                    </>
                                ) : (
                                    <div className={styles.no_message}>
                                        Пусто!
                                    </div>
                                )}
                            </div>
                            <form
                                className={styles.form}
                                onSubmit={handleSendMessage}
                            >
                                <input
                                    ref={ref}
                                    type="text"
                                    className={styles.input_chat}
                                    value={inputText}
                                    onChange={handleInputChange}
                                    placeholder="Написать в чат"
                                />
                                <button className={styles.send}>
                                    <img src={sendMessage} alt="Send" />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={setIsOpen}
                            className={styles.chatOpenner}
                            id="test-button-openCloseChat"
                        >
                            <img src={chatIcon} alt="Чат" />
                            <span>Чат</span>
                        </button>
                    </div>
                )}
            </>
        );
    }
);
