import { FC, useContext, useEffect, useState } from "react";
import { MediatorContext, ServerContext } from "../../../../App";
import GameTime from "../GameTime/GameTime";
import { GameAlert, EGameStatus } from "../GameAlert/GameAlert";
import { Chat, EChat } from "../../../../components";

import styles from "./GameOverlay.module.scss";

export const GameOverlay: FC = () => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);

    const [gameStatus, setGameStatus] = useState<EGameStatus | null>(null);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    useEffect(() => {
        const { END_GAME } = mediator.getEventTypes();
        mediator.subscribe(END_GAME, (status: EGameStatus) => {
            setGameStatus(status);
        });
    }, []);

    const chatHandler = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className={styles.overlay}>
            <GameTime />
            <GameAlert gameStatus={gameStatus} />
            {!gameStatus && (
                <button
                    id="test_leave_game_button"
                    className={styles.leave}
                    onClick={() => server.suicide()}
                >
                    Сбежать
                </button>
            )}
            <div className={styles.chatBlock}>
                <Chat
                    isOpen={isChatOpen}
                    setIsOpen={chatHandler}
                    chatType={EChat.game}
                />
            </div>
        </div>
    );
};
