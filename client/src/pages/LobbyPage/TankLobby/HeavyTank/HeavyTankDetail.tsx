import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { useSetRoleHandler } from "../../../../hooks/useSetRoleHandler";
import { MediatorContext, ServerContext } from "../../../../App";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import {
    EGamerRole,
    IHeavyTank,
    ILobby,
} from "../../../../modules/Server/interfaces";

import { ReactComponent as HeavyTank } from "./heavyTank.svg";
import CrossIcon from "../closeIcon.png";

import styles from "../Detail.module.scss";

const HeavyTankDetail: FC = () => {
    const [tank, setTank] = useState<IHeavyTank>({
        Commander: false,
        Gunner: false,
        Mechanic: false,
        id: 0,
    });
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);
    const navigate = useNavigate();
    const params = useParams();
    const setRoleHandler = useSetRoleHandler();

    useEffect(() => {
        const { LOBBY_UPDATE } = mediator.getTriggerTypes();
        const { GO_TO_TANK } = mediator.getEventTypes();

        mediator.subscribe(GO_TO_TANK, (tank: { tankId: number }) => {
            tankUpdate(tank.tankId);
        });

        mediator.set(LOBBY_UPDATE, () => {
            tankUpdate();
        });
    }, []);

    const tankUpdate = (id: number | null = null) => {
        const currentId = id ? id : Number(params.id);
        if (id) {
            const newTank = server.STORE.getLobby().tanks.heavyTank.find(
                (tank) => tank.id === currentId
            );
            if (newTank) {
                return setTank(newTank);
            }
        }
    };

    const goBack = () => {
        navigate("/heavy_tanks");
    };

    const calcPlaces = (): string => {
        const placesCount = 3;
        var occupiedPlacesCount = 0;
        tank.Gunner && occupiedPlacesCount++;
        tank.Mechanic && occupiedPlacesCount++;
        tank.Commander && occupiedPlacesCount++;

        return `${occupiedPlacesCount}/${placesCount}`;
    };

    return (
        <div className={styles.details}>
            <div className={styles.info}>
                <p>Тяжёлый танк {tank.id ? `№${tank.id}` : ""}</p>
                <p>Занято мест {calcPlaces()}</p>
            </div>
            <div className={cn(styles.svg_wrapper, styles.heavy_tank)}>
                <div
                    id="test_button_tank_commander"
                    onClick={() =>
                        setRoleHandler(EGamerRole.heavyTankCommander, tank.id)
                    }
                    className={cn(styles.commander, {
                        [styles.unavailable]: tank.Commander,
                    })}
                >
                    Командир
                </div>
                <div
                    id="test_button_shooter3"
                    onClick={() =>
                        setRoleHandler(EGamerRole.heavyTankGunner, tank.id)
                    }
                    className={cn(styles.gunner, {
                        [styles.unavailable]: tank.Gunner,
                    })}
                >
                    Наводчик
                </div>
                <div
                    id="test_button_tankDriver3"
                    onClick={() =>
                        setRoleHandler(EGamerRole.heavyTankMeh, tank.id)
                    }
                    className={cn(styles.driver, {
                        [styles.unavailable]: tank.Mechanic,
                    })}
                >
                    МехВод
                </div>
                <HeavyTank />
            </div>
            <img
                id={"test_button_cross"}
                className={styles.close}
                src={CrossIcon}
                alt="Закрыть"
                onClick={goBack}
            />
        </div>
    );
};

export default withLayout(HeavyTankDetail);
