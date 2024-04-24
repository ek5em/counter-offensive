import { FC, useContext, useEffect, useState } from "react";
import cn from "classnames";
import { MediatorContext, ServerContext } from "../../App";
import {
    getRankImg,
    getRankName,
    getExpString,
    getExpPersents,
} from "../../helpers";
import { Logo } from "../UI";
import { ELogo } from "../UI/Logo/Logo";
import { IGamerInfo } from "../../modules/Server/interfaces";
import DossierImage from "./dossierImage.png";

import styles from "./Header.module.scss";

export const Header: FC = () => {
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

    return (
        <header className={styles.header}>
            <div className={styles.userInfo}>
                <img src={DossierImage} />
                <div className={styles.name}>
                    <p>{user?.nickname}</p>
                    <div className={styles.rank}>
                        <span>{getRankName(user?.rank_name)}</span>
                        <span>
                            <img src={getRankImg(user?.rank_name)} />
                        </span>
                    </div>
                </div>
            </div>
            <div className={styles.exp_progress}>
                <div className={styles.progress_bar}>
                    <div
                        className={cn(styles.progress, {
                            [styles.full]:
                                getExpPersents(
                                    user?.gamer_exp,
                                    user?.next_rank
                                ) === 1,
                        })}
                        style={{
                            width: `${
                                getExpPersents(
                                    user?.gamer_exp,
                                    user?.next_rank
                                ) * 100
                            }%`,
                        }}
                    />
                    <span>
                        {getExpString(user?.gamer_exp, user?.next_rank)}
                    </span>
                </div>
            </div>
            <Logo size={ELogo.small} className={styles.logo} />
        </header>
    );
};
