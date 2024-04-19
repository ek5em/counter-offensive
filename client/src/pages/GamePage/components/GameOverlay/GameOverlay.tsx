import { FC, HTMLAttributes, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { MediatorContext, ServerContext } from "../../../../App";

import styles from "./GameOverlay.module.scss";

export enum EGameStatus {
    victory = "victory",
    defeat = "defeat",
}

interface Props extends HTMLAttributes<HTMLDivElement> {}

const GameOverlay: FC<Props> = ({ className, ...props }) => {
    const mediator = useContext(MediatorContext);
    const server = useContext(ServerContext);
    const navigate = useNavigate();

    const [gameStatus, setGameStatus] = useState<EGameStatus | null>(null);

    useEffect(() => {
        const { THROW_TO_LOBBY } = mediator.getTriggerTypes();
        mediator.set(THROW_TO_LOBBY, (status: EGameStatus) => {
            setGameStatus(status);
            setTimeout(() => {
                setGameStatus(null);
                navigate("/");
            }, 3000);
        });
    });
    return (
        <>
            {gameStatus && (
                <div
                    id="test_game_time"
                    className={cn(styles.overlay, className)}
                    {...props}
                >
                    <h1 className={styles[gameStatus]}>
                        {gameStatus === EGameStatus.victory
                            ? "Победа"
                            : "Подбит"}
                    </h1>
                </div>
            )}
        </>
    );
};

export default GameOverlay;
