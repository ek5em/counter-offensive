import { FC, useContext} from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import { Button, EButtonAppearance } from "../../../../components";

import styles from "../Lobby.module.scss";
import { MediatorContext, ServerContext } from "../../../../App";

const HeavyTankLobby: FC = () => {
    const server = useContext(ServerContext);
    const navigate = useNavigate();

    const tanks = server.STORE.getLobby().tanks.heavyTank;
    const addTankHandler = () => {
        navigate("/heavy_tanks/myTank");
    };

    const selectTankHandler = (id: number) => {
        navigate(`/heavy_tanks/${id}`);
    };

    const goBack = () => {
        navigate("/");
    };

    return (
        <div className={styles.lobby}>
            {
                <div className={styles.list}>
                    <div className={styles.actions}>
                        <Button
                            appearance={EButtonAppearance.primary}
                            id="test_button_add_tank"
                            onClick={addTankHandler}
                        >
                            Добавить танк
                        </Button>
                        <Button
                            appearance={EButtonAppearance.primary}
                            id="test_button_back_to_lobby"
                            onClick={goBack}
                        >
                            Назад
                        </Button>
                    </div>
                    {tanks.map((tank) => (
                        <div
                            className={styles.tank}
                            key={tank.id}
                            onClick={() => selectTankHandler(tank.id)}
                        >
                            <div>Танк №{tank.id}</div>
                            <div className={styles.circles}>
                                <div
                                    className={cn({
                                        [styles.occupied]: tank.Commander,
                                    })}
                                />
                                <div
                                    className={cn({
                                        [styles.occupied]: tank.Gunner,
                                    })}
                                />
                                <div
                                    className={cn({
                                        [styles.occupied]: tank.Mechanic,
                                    })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
};

export default withLayout(HeavyTankLobby);
