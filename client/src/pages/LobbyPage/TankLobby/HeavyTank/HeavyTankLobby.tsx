import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { useGlobalContext } from "../../../../hooks/useGlobalContext";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import { Button, EButtonAppearance } from "../../../../components";
import { IHeavyTank } from "../../../../modules/Server/interfaces";

import styles from "../Lobby.module.scss";

const HeavyTankLobby: FC = () => {
    const { server, mediator } = useGlobalContext();
    const [tanks, setTanks] = useState<IHeavyTank[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const { LOBBY_UPDATE } = mediator.getEventTypes();
        mediator.subscribe(LOBBY_UPDATE, () => {
            updateTankList();
        });
        updateTankList();
    }, []);

    const updateTankList = () => {
        setTanks(server.STORE.getLobby().tanks.heavyTank ?? []);
    };

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
