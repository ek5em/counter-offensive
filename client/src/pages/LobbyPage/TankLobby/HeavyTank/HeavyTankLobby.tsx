import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import { Button, EButtonAppearance } from "../../../../components";

import styles from "../Lobby.module.scss";
import { MediatorContext, ServerContext } from "../../../../App";
import { IHeavyTank } from "../../../../modules/Server/interfaces";

const HeavyTankLobby: FC = () => {
    const [tanks, setTanks] = useState<IHeavyTank[]>([]);
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);
    const navigate = useNavigate();

    useEffect(() => {
        const { LOBBY_UPDATE } = mediator.getTriggerTypes();
        mediator.set(LOBBY_UPDATE, () => {
            updateTankList();
        });
        updateTankList();
    }, []);

    const updateTankList = () => {
        setTanks(server.STORE.getLobby().tanks.heavyTank);
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
