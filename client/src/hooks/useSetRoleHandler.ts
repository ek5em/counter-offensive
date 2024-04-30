import { EGamerRole } from "../modules/Server/interfaces";
import { useGlobalContext } from "./useGlobalContext";

export const useSetRoleHandler = () => {
    const { server } = useGlobalContext();

    return (role: EGamerRole, tank_id: number | null = null) => {
        server.setGamerRole(role, tank_id ? tank_id : null);
    };
};
