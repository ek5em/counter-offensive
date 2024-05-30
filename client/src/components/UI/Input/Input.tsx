import { useState, FC } from "react";
import { ReactComponent as OpenEyeIcon } from "./openEye.svg";
import { ReactComponent as CloseEyeIcon } from "./closeEye.svg";
import cn from "classnames";

import styles from "./Input.module.scss";

export enum EInput {
    text = "text",
    password = "password",
}

interface IInputProps {
    id: string;
    text: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    type?: EInput;
}

export const Input: FC<IInputProps> = ({
    text,
    id,
    className,
    type = EInput.text,
    onChange,
}) => {
    const [inputType, setInputType] = useState<EInput>(type);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const changeType = () => {
        setInputType(inputType === EInput.text ? EInput.password : EInput.text);
    };

    return (
        <div className={styles.wrapper}>
            <input
                id={id}
                type={inputType}
                onChange={onChangeHandler}
                placeholder={text}
                autoComplete="off"
                className={cn(styles.input, className, {
                    [styles.password]: type === EInput.password,
                })}
            />
            {type === EInput.password && (
                <div onClick={changeType} className={styles.eye}>
                    {inputType === EInput.text ? (
                        <OpenEyeIcon data-testid="open-eye-icon" />
                    ) : (
                        <CloseEyeIcon data-testid="close-eye-icon" />
                    )}
                </div>
            )}
        </div>
    );
};
