import { useContext } from "react";
import { EGamerRole } from "../modules/Server/interfaces";
import { ServerContext } from "../App";

export const useSetRoleHandler = () => {
    const server = useContext(ServerContext);
    return (role: EGamerRole, tank_id: number | null = null) => {
        server.setGamerRole(role, tank_id ? tank_id : null);
    };
};
