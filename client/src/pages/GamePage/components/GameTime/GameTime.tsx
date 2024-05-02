import { FC, useEffect, useState } from "react";
import { useGlobalContext } from "../../../../hooks/useGlobalContext";
import { timeConvert } from "../../../../helpers";

import styles from "./GameTime.module.scss";

const GameTime: FC = () => {
    const { mediator } = useGlobalContext();
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
