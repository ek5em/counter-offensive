import { FC, useState } from "react";
import cn from "classnames";
import { useGlobalContext } from "../../../hooks/useGlobalContext";
import { useSetRoleHandler } from "../../../hooks/useSetRoleHandler";
import { withLayout } from "../../../components/LobbyLayout/Layout";
import { EGamerRole } from "../../../modules/Server/interfaces";
import { Button, Chat, EButtonAppearance, EChat } from "../../../components";
import { UnitButton } from "../../../components/UI";
import { automat, RPG, flag, general } from "./assets";

import styles from "./LobbyInfo.module.scss";

const LobbyInfo: FC = () => {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const { server } = useGlobalContext();

    const setRoleHandler = useSetRoleHandler();

    const lobby = server.STORE.getLobby();

    const logoutHandler = () => {
        server.logout();
    };

    const handleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            <UnitButton
                src={automat}
                role="Солдат"
                id="test_button_infantrymanGun"
                onClick={() => setRoleHandler(EGamerRole.infantry)}
            />
            <UnitButton
                src={RPG}
                role="РПГ-шник"
                id="test_button_infantrymanRPG"
                onClick={() => setRoleHandler(EGamerRole.infantryRPG)}
            />
            <UnitButton
                src={flag}
                role="Знаменосец"
                id="test_button_standartBearer"
                className={cn({
                    selected_role: !lobby?.bannerman,
                })}
                onClick={() => setRoleHandler(EGamerRole.bannerman)}
            />
            <UnitButton
                src={general}
                role="Генерал"
                id="test_button_general"
                className={cn({
                    selected_role: !lobby.general,
                    disabled: isChatOpen,
                })}
                onClick={() => setRoleHandler(EGamerRole.general)}
            />
            <div className={cn({ [styles.opened]: isChatOpen })}>
                <div className={styles.info}>
                    <Chat
                        isOpen={isChatOpen}
                        setIsOpen={handleChat}
                        chatType={EChat.lobby}
                        className={styles.chat}
                    />
                    {!isChatOpen && (
                        <div className={styles.ratingAndLogout}>
                            <Button
                                appearance={EButtonAppearance.secondary}
                                className={styles.rating}
                            >
                                Рейтинг
                            </Button>
                            <Button
                                appearance={EButtonAppearance.primary}
                                id="test-button-goToMenu"
                                onClick={logoutHandler}
                                className={styles.logout}
                            >
                                Выйти из Бахмута
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withLayout(LobbyInfo);
