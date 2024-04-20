import { FC, useContext, useEffect, useState } from "react";
import cn from "classnames";
import { MediatorContext, ServerContext } from "../../../../App";
import { ERank, IGamerInfo } from "../../../../modules/Server/interfaces";
import { Button, EButtonAppearance } from "../../../../components";
import DossierImage from "./dossierImage.png";

import styles from "./Dossier.module.scss";

export const Dossier: FC = () => {
    const [user, setUser] = useState<IGamerInfo | null>(null);
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);

    const { UPDATE_USER } = mediator.getTriggerTypes();

    useEffect(() => {
        const user = server.STORE.getUser();
        user && setUser(user);
    }, [server.STORE.user]);

    useEffect(() => {
        mediator.set(UPDATE_USER, (user: IGamerInfo) => {
            setUser(user);
        });
    }, []);

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

    const expCalc = (gamer_exp: number, next_rank: number): number => {
        const persent = gamer_exp / (gamer_exp + next_rank);
        if (persent >= 1) {
            return 1;
        }
        return persent;
    };

    const expString = (gamer_exp: number, next_rank: number): string => {
        if (next_rank <= 0) {
            return `${gamer_exp}`;
        }
        return `${gamer_exp}/${gamer_exp + next_rank}`;
    };

    return (
        <div>
            {user && (
                <div className={styles.dossier}>
                    <div className={styles.user}>
                        <div className={styles.image}>
                            <img src={DossierImage} />
                        </div>
                        <div className={styles.info}>
                            <p>{user.nickname}</p>
                            <p>{rank(user.rank_name)}</p>
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
                                    [styles.full]:
                                        expCalc(
                                            user.gamer_exp,
                                            user.next_rank
                                        ) === 1,
                                })}
                                style={{
                                    width: `${
                                        expCalc(
                                            user.gamer_exp,
                                            user.next_rank
                                        ) * 100
                                    }%`,
                                }}
                            />
                            <span>
                                {expString(user.gamer_exp, user.next_rank)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
