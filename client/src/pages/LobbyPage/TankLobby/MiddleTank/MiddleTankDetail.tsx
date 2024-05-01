import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { useSetRoleHandler } from "../../../../hooks/useSetRoleHandler";
import { useGlobalContext } from "../../../../hooks/useGlobalContext";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import { EGamerRole, IMiddleTank } from "../../../../modules/Server/interfaces";
import { closeIcon } from "../../../../assets/png";
import { ReactComponent as MiddleTank } from "./middleTank.svg";

import styles from "../Detail.module.scss";

const TankDetail: FC = () => {
    const { server, mediator } = useGlobalContext();
    const [tank, setTank] = useState<IMiddleTank>({
        Gunner: false,
        Mechanic: false,
        id: 0,
    });
    const navigate = useNavigate();
    const params = useParams();
    const setRoleHandler = useSetRoleHandler();

    useEffect(() => {
        const { GO_TO_TANK, LOBBY_UPDATE } = mediator.getEventTypes();

        mediator.subscribe(LOBBY_UPDATE, () => {
            tankUpdate();
        });

        mediator.subscribe(GO_TO_TANK, (newTank: { tankId: number }) => {
            if (newTank.tankId !== tank.id) {
                tankUpdate(newTank.tankId);
            }
        });

        tankUpdate();
    }, []);

    const tankUpdate = (id: number | null = null) => {
        const currentId = id ? id : params.id;
        const tanks = server.STORE.getLobby().tanks.middleTank;
        if (currentId !== "myTank") {
            const newTank = tanks.find((tank) => tank.id === Number(currentId));
            if (newTank) {
                return setTank(newTank);
            }
        }
    };

    const goBack = () => {
        navigate("/middle_tanks");
    };

    const calcPlaces = (): string => {
        const placesCount = 2;
        var occupiedPlacesCount = 0;
        tank.Gunner && occupiedPlacesCount++;
        tank.Mechanic && occupiedPlacesCount++;

        return `${occupiedPlacesCount}/${placesCount}`;
    };

    return (
        <div className={styles.details}>
            <div className={styles.info}>
                <p>Средний танк {tank.id ? `№${tank.id}` : ""}</p>
                <p>Занято мест {calcPlaces()}</p>
            </div>
            <div className={cn(styles.svg_wrapper, styles.middle_tank)}>
                <div
                    id={"test_button_shooter2"}
                    onClick={() =>
                        setRoleHandler(EGamerRole.middleTankGunner, tank.id)
                    }
                    className={cn(styles.gunner, {
                        [styles.unavailable]: tank.Gunner,
                    })}
                >
                    Наводчик
                </div>
                <div
                    id={"test_button_tankDriver2"}
                    onClick={() =>
                        setRoleHandler(EGamerRole.middleTankMeh, tank.id)
                    }
                    className={cn(styles.driver, {
                        [styles.unavailable]: tank.Mechanic,
                    })}
                >
                    МехВод
                </div>
                <MiddleTank />
            </div>
            <img
                id={"test_button_cross"}
                className={styles.close}
                src={closeIcon}
                alt="Закрыть"
                onClick={goBack}
            />
        </div>
    );
};

export default withLayout(TankDetail);
