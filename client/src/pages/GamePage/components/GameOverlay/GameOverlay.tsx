import { FC, useContext } from "react";
import { ServerContext } from "../../../../App";
import GameTime from "../GameTime/GameTime";
import GameAlert from "../GameAlert/GameAlert";

import styles from "./GameOverlay.module.scss";
import { Chat, EChat } from "../../../../components";

export const GameOverlay: FC = () => {
    const server = useContext(ServerContext);

    return (
        <div className={styles.overlay}>
            <GameTime />
            <GameAlert />
            <button
                id="test_leave_game_button"
                className={styles.leave}
                onClick={() => server.suicide()}
            >
                Сбежать
            </button>
            <Chat isOpen={false} setIsOpen={() => {}} chatType={EChat.game} />
        </div>
    );
};
