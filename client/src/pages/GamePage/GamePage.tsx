import { useRef } from "react";
import GameCanvas from "./components/GameCanvas/GameCanvas";
import { GameOverlay } from "./components/GameOverlay/GameOverlay";
import styles from "./GamePage.module.scss";

const GamePage: React.FC = () => {
    const chatInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className={styles.game}>
            <GameOverlay inputRef={chatInputRef} />
            <GameCanvas inputRef={chatInputRef} />
        </div>
    );
};
export default GamePage;
