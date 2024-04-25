import { useRef } from "react";
import { Chat, EChat } from "../../components";
import GameCanvas from "./components/GameCanvas/GameCanvas";
import { GameOverlay } from "./components/GameOverlay/GameOverlay";
import styles from "./GamePage.module.scss";

const GamePage: React.FC = () => {
    const chatInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className={styles.game}>
            <GameOverlay />
            <GameCanvas inputRef={chatInputRef} />
        </div>
    );
};
export default GamePage;
