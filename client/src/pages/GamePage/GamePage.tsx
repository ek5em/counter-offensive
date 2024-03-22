import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ServerContext } from "../../App";
import { Chat, EChat } from "../../components";
import GameCanvas from "./components/GameCanvas/GameCanvas";
import GameOverlay from "./components/GameOverlay/GameOverlay";
import GameTime from "./components/GameTime/GameTime";
import styles from "./GamePage.module.scss";

const GamePage: React.FC = () => {
    const chatInputRef = useRef<HTMLInputElement | null>(null);
    const server = useContext(ServerContext);
    const navigate = useNavigate();

    const leaveGameHandler = async () => {
        const res = await server.suicide();
        if (res) {
            navigate("/", { replace: true });
        }
    };
    return (
        <div className={styles.game}>
            <GameOverlay />
            <GameTime />
            <button
                id="test_leave_game_button"
                className={styles.leave_button}
                onClick={leaveGameHandler}
            >
                Сбежать
            </button>
            <GameCanvas inputRef={chatInputRef} />
            <div className={styles.chat}>
                <Chat chatType={EChat.game} ref={chatInputRef} />
            </div>
        </div>
    );
};
export default GamePage;
