import { FC } from "react";

import styles from "./GameAlert.module.scss";

export enum EGameStatus {
    victory = "victory",
    defeat = "defeat",
}

interface IGameAlert {
    gameStatus: EGameStatus | null;
}

export const GameAlert: FC<IGameAlert> = ({ gameStatus }) => {
    return (
        <>
            {gameStatus && (
                <div id="test_game_time" className={styles.alert}>
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
