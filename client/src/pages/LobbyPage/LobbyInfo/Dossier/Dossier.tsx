import { FC, useContext } from "react";
import cn from "classnames";
import { ServerContext } from "../../../../App";
import { ERank, IUserInfo } from "../../../../modules/Server/interfaces";
import { Button, EButtonAppearance } from "../../../../components";
import DossierImage from "./dossierImage.png";

import styles from "./Dossier.module.scss";

export const Dossier: FC = () => {
    const server = useContext(ServerContext);
    const {
        nickname,
        rank_name,
        gamer_exp,
        next_rang: next_rank,
    } = server.STORE.user as IUserInfo;

    const rank = (rankName: ERank) => {
        switch (rankName) {
            case ERank.General: {
                return "Генерал";
            }
            case ERank.Officer: {
                return "Офицер";
            }
            case ERank.Private: {
                return "Рядовой";
            }
            case ERank.Sergeant: {
                return "Сержант";
            }
        }
    };

    const expCalc = (): number => {
        const persent = gamer_exp / (gamer_exp + next_rank);
        if (persent >= 1) {
            return 1;
        }
        return persent;
    };

    const expString = (): string => {
        if (next_rank <= 0) {
            return `${gamer_exp}`;
        }
        return `${gamer_exp}/${gamer_exp + next_rank}`;
    };

    return (
        <div className={styles.dossier}>
            <div className={styles.user}>
                <div className={styles.image}>
                    <img src={DossierImage} />
                </div>
                <div className={styles.info}>
                    <p>{nickname}</p>
                    <p>{rank(rank_name)}</p>
                </div>
                <Button
                    id="test_button_showcaseOfAchievements"
                    appearance={EButtonAppearance.primary}
                    className={styles.achievements}
                >
                    Витрина достижений
                </Button>
            </div>
            <div className={styles.exp_progress}>
                <div className={styles.progress_bar}>
                    <div
                        className={cn(styles.progress, {
                            [styles.full]: expCalc() === 1,
                        })}
                        style={{
                            width: `${expCalc() * 100}%`,
                        }}
                    />
                    <span>{expString()}</span>
                </div>
            </div>
        </div>
    );
};
