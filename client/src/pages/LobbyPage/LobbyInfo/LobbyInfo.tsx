import { FC, useContext, useState } from "react";
import cn from "classnames";
import { useSetRoleHandler } from "../../../hooks/useSetRoleHandler";
import { MediatorContext, ServerContext } from "../../../App";
import { withLayout } from "../../../components/LobbyLayout/Layout";
import { EGamerRole, ILobby } from "../../../modules/Server/interfaces";
import { Button, Chat, EButtonAppearance, EChat } from "../../../components";
import { Dossier } from "./Dossier/Dossier";
import { chatIcon } from "../../../components/Chat/assets";
import { automat, RPG, flag } from "./assets";

import styles from "./LobbyInfo.module.scss";

enum EOpen {
    chat,
    info,
}

const LobbyInfo: FC<{ lobby: ILobby | null }> = ({ lobby }) => {
    const [isOpen, setIsOpen] = useState<EOpen>(EOpen.info);
    const mediator = useContext(MediatorContext);
    const server = useContext(ServerContext);
    const setRoleHandler = useSetRoleHandler();

    const logoutHandler = async () => {
        const { LOGOUT } = mediator.getTriggerTypes();
        const res = await server.logout();
        res && mediator.get(LOGOUT);
    };

    const handleChat = () => {
        switch (isOpen) {
            case EOpen.chat: {
                return setIsOpen(EOpen.info);
            }
            case EOpen.info: {
                return setIsOpen(EOpen.chat);
            }
        }
    };

    return (
        <>
            <div className={cn(styles.units)}>
                <button
                    id="test_button_standartBearer"
                    className={cn({
                        selected_role: !lobby?.bannerman,
                    })}
                    onClick={() => setRoleHandler(EGamerRole.bannerman)}
                >
                    <span>Знаменосец</span>
                    <div>
                        <img src={flag} alt="Знаменосец" />
                    </div>
                </button>
                <button
                    id="test_button_infantrymanRPG"
                    onClick={() => setRoleHandler(EGamerRole.infantryRPG)}
                >
                    <span>Пехотинец с гранотомётом</span>
                    <div>
                        <img src={RPG} alt="Гранатометчик" />
                    </div>
                </button>
                <button
                    id="test_button_infantrymanGun"
                    onClick={() => setRoleHandler(EGamerRole.infantry)}
                >
                    <span>Пехотинец-автоматчик</span>
                    <div>
                        <img src={automat} alt="Автоматчик" />
                    </div>
                </button>
            </div>
            <div className={styles.info}>
                <button
                    className={styles.chat_btn}
                    id="test-button-openCloseChat"
                    onClick={handleChat}
                >
                    <img src={chatIcon} alt="Чат" />
                    <span>Чат</span>
                </button>
                {isOpen === EOpen.chat ? (
                    <div className={styles.chat}>
                        <Chat chatType={EChat.lobby} />
                    </div>
                ) : (
                    <>
                        <div>
                            <Dossier />
                        </div>
                        <Button
                            appearance={EButtonAppearance.primary}
                            id="test-button-goToMenu"
                            onClick={logoutHandler}
                            className={styles.logout}
                        >
                            Выйти из Бахмута
                        </Button>
                    </>
                )}
            </div>
        </>
    );
};

export default withLayout(LobbyInfo);
