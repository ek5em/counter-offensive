import { FC, useContext, useEffect, useState } from "react";
import { MediatorContext } from "../../../../App";
import { timeConvert } from "../../../../helpers";

import styles from "./GameTime.module.scss";

const GameTime: FC = () => {
    const mediator = useContext(MediatorContext);
    const { UPDATE_TIME } = mediator.getTriggerTypes();
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        mediator.set(UPDATE_TIME, (time: number) => {
            setTime(time);
        });

        const timer = setInterval(() => {
            setTime((t) => t + 1000);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={styles.time}>
            <span>{timeConvert(time)}</span>
        </div>
    );
};

export default GameTime;
