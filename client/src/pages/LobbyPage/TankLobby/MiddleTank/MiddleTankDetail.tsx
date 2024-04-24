import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { useSetRoleHandler } from "../../../../hooks/useSetRoleHandler";
import { MediatorContext, ServerContext } from "../../../../App";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import { EGamerRole, IMiddleTank } from "../../../../modules/Server/interfaces";

import { closeIcon } from "../../../../assets/png";
import { ReactComponent as MiddleTank } from "./middleTank.svg";

import styles from "../Detail.module.scss";

const TankDetail: FC = () => {
    const [tank, setTank] = useState<IMiddleTank>({
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

<<<<<<< HEAD
        mediator.subscribe(GO_TO_TANK, (tank: { tankId: number }) => {
            tankUpdate(tank.tankId);
=======
        mediator.subscribe(GO_TO_TANK, (newTank: { tankId: number }) => {
            if (newTank.tankId !== tank.id) {
                tankUpdate(newTank.tankId);
            }
>>>>>>> 35e4b0df73cde1a5b4ee3453dec1a996f808eaef
        });

        mediator.set(LOBBY_UPDATE, () => {
            tankUpdate();
        });
    }, []);

    const tankUpdate = (id: number | null = null) => {
        const currentId = id ? id : Number(params.id);
<<<<<<< HEAD
        if (id) {
=======
        if (currentId) {
>>>>>>> 35e4b0df73cde1a5b4ee3453dec1a996f808eaef
            const newTank = server.STORE.getLobby().tanks.middleTank.find(
                (tank) => tank.id === currentId
            );
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
