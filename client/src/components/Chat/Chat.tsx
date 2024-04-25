import {
    useContext,
    forwardRef,
    useEffect,
    useRef,
    useState,
    HTMLAttributes,
    DetailedHTMLProps,
} from "react";
import cn from "classnames";
import { MediatorContext, ServerContext } from "../../App";
import { IMessage } from "../../modules/Server/interfaces";
import { sendMessage, chatIcon } from "./assets";

import styles from "./Chat.module.scss";
import { getRankImg } from "../../helpers";
import { closeIcon } from "../../assets/png";

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
        const server = useContext(ServerContext);
        const mediator = useContext(MediatorContext);

        const [messages, setMessages] = useState<IMessage[]>([]);
        const [inputText, setInputText] = useState<string>("");

        const messagesEndRef = useRef<null | HTMLDivElement>(null);

        const { NEW_MESSAGE, SEND_MESSAGE_STATUS } = mediator.getTriggerTypes();

        useEffect(() => {
            mediator.set(NEW_MESSAGE, (newMessages: IMessage[]) => {
                setMessages(newMessages.reverse());
            });

            mediator.set(SEND_MESSAGE_STATUS, (status: true | null) => {
                if (status) {
                    setInputText("");
                    scrollToBottom();
                }
            });

            server.getMessages();
        }, []);

        useEffect(() => {
            scrollToBottom();
        });

        const scrollToBottom = () => {
            messagesEndRef.current &&
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
                                        {messages.map((message, i) => (
                                            <div
                                                key={i}
                                                className={cn(styles.message, {
                                                    [styles.myMessge]:
                                                        server.STORE.getUser()
                                                            ?.id ===
                                                        message.userId,
                                                })}
                                            >
                                                <span className={styles.name}>
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
