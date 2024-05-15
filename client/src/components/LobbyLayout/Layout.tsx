import { FunctionComponent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { ETank } from "../../modules/Server/interfaces";
import { UnitButton } from "../UI";
import { Header } from "..";
import { tank2, tank3 } from "./assets";

import styles from "./Layout.module.scss";
import { useGlobalContext } from "../../hooks/useGlobalContext";

export const withLayout = (Component: FunctionComponent) => {
    return (): JSX.Element => {
        const navigate = useNavigate();
        const location = useLocation();
        const {server} = useGlobalContext();

        useEffect(() => {
            server.getLobby();
        }, [])

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
                <Header />
                <div className={styles.lobby}>
                    <UnitButton
                        src={tank2}
                        role="Средний танк"
                        id="test_button_2tank"
                        className={cn({
                            [styles.tank_selected]: path === "middle_tanks",
                        })}
                        onClick={() => onClickTankLobbyHandler(ETank.middle)}
                    />
                    <UnitButton
                        src={tank3}
                        role="Тяжёлый танк"
                        id="test_button_3tank"
                        className={cn({
                            [styles.tank_selected]: path === "heavy_tanks",
                        })}
                        onClick={() => onClickTankLobbyHandler(ETank.heavy)}
                    />
                    <Component />
                </div>
            </div>
        );
    };
};
