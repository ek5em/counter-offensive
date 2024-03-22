import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { ILobby, IMiddleTank } from "../../../../modules/Server/interfaces";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import { Button, EButtonAppearance } from "../../../../components";

import styles from "../Lobby.module.scss";

const MiddleTankLobby: FC<{ lobby: ILobby | null }> = ({ lobby }) => {
    const [tanks, setTanks] = useState<IMiddleTank[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        lobby && setTanks(lobby.tanks.middleTank);
    }, [lobby]);

    const addTankHandler = () => {
        navigate("/middle_tanks/myTank");
    };

    const selectTankHandler = (id: number) => {
        navigate(`/middle_tanks/${id}`);
    };

    const goBack = () => {
        navigate("/");
    };

    return (
        <div className={styles.lobby}>
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
        </div>
    );
};

export default withLayout(MiddleTankLobby);
