import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { MediatorContext, ServerContext } from "../../App";
import { requestDelay } from "../../config";
import { useSetRoleHandler } from "../../hooks/useSetRoleHandler";
import {
    EGamerRole,
    EHash,
    ETank,
    ILobby,
} from "../../modules/Server/interfaces";
import { Logo } from "..";
import { tank2, tank3, general } from "./assets";

import styles from "./Layout.module.scss";

export const withLayout = (
    Component: FunctionComponent<{ lobby: ILobby | null }>
) => {
    return (): JSX.Element => {
        const [lobby, setLobby] = useState<ILobby>({
            userInfo: null,
            bannerman: true,
            general: true,
            is_alive: null,
            tanks: {
                heavyTank: [],
                middleTank: [],
            },
        });

        const server = useContext(ServerContext);
        const mediator = useContext(MediatorContext);
        const setRoleHandler = useSetRoleHandler();
        const navigate = useNavigate();
        const location = useLocation();

        const { THROW_TO_GAME } = mediator.getTriggerTypes();
        const path = location.pathname.split("/")[1];

        useEffect(() => {
            const interval = setInterval(async () => {
                const res = await server.getLobby();
                if (res && res !== true) {
                    if (res.lobby.is_alive) {
                        if (server.STORE.user) {
                            server.STORE.user.unit = res.lobby.is_alive;
                            return mediator.get(THROW_TO_GAME);
                        }
                    }
                    if (res.lobby.userInfo && server.STORE.user) {
                        const { gamer_exp, next_rang, rank_name } =
                            res.lobby.userInfo;
                        server.STORE.user = {
                            ...server.STORE.user,
                            gamer_exp,
                            next_rang,
                            rank_name,
                        };
                    }
                    server.STORE.setHash(EHash.lobby, res.lobbyHash);
                    setLobby(res.lobby);
                }
            }, requestDelay.lobby);
            return () => {
                server.STORE.setHash(EHash.lobby, null);
                clearInterval(interval);
            };
        }, []);

        const onClickTankLobbyHandler = (switchTo: ETank): void => {
            const replace: boolean =
                path === "heavy_tanks" || path === "middle_tanks";

            switch (switchTo) {
                case ETank.heavy: {
                    return navigate("/heavy_tanks", { replace });
                }
                case ETank.middle: {
                    return navigate("/middle_tanks", { replace });
                }
            }
        };

        return (
            <div className={styles.wrapper}>
                <Logo />
                <div className={styles.lobby}>
                    <div className={cn(styles.units)}>
                        <button
                            id="test_button_general"
                            className={cn({
                                selected_role: !lobby.general,
                            })}
                            onClick={() => setRoleHandler(EGamerRole.general)}
                        >
                            <span>Генерал</span>
                            <div>
                                <img src={general} alt="Генерал" />
                            </div>
                        </button>
                        <button
                            id="test_button_2tank"
                            className={cn({
                                tank_selected: path === "middle_tanks",
                            })}
                            onClick={() =>
                                onClickTankLobbyHandler(ETank.middle)
                            }
                        >
                            <span>Двухместный танк</span>
                            <div>
                                <img src={tank2} alt="Танк2" />
                            </div>
                        </button>
                        <button
                            id="test_button_3tank"
                            className={cn({
                                tank_selected: path === "heavy_tanks",
                            })}
                            onClick={() => onClickTankLobbyHandler(ETank.heavy)}
                        >
                            <span>Трёхместный танк</span>
                            <div>
                                <img src={tank3} alt="Танк3" />
                            </div>
                        </button>
                    </div>
                    <Component lobby={lobby} />
                </div>
            </div>
        );
    };
};
