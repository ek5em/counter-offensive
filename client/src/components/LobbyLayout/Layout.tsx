import { FunctionComponent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { useSetRoleHandler } from "../../hooks/useSetRoleHandler";
import { EGamerRole, ETank } from "../../modules/Server/interfaces";
import { Logo } from "..";
import { tank2, tank3, general } from "./assets";

import styles from "./Layout.module.scss";

export const withLayout = (Component: FunctionComponent) => {
    return (): JSX.Element => {
        const setRoleHandler = useSetRoleHandler();
        const navigate = useNavigate();
        const location = useLocation();

        const path = location.pathname.split("/")[1];

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
                                /* selected_role: !lobby.general, */
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
                    <Component />
                </div>
            </div>
        );
    };
};
