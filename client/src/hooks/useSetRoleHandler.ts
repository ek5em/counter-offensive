import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ServerContext } from "../App";
import { EGamerRole } from "../modules/Server/interfaces";

export const useSetRoleHandler = () => {
   const server = useContext(ServerContext);
   const navigate = useNavigate();
   return async (role: EGamerRole, tank_id: number | null = null) => {
      const res = await server.setGamerRole(role, tank_id);

      if (res) {
         switch (role) {
            case EGamerRole.heavyTankCommander:
            case EGamerRole.heavyTankGunner:
            case EGamerRole.heavyTankMeh: {
               return navigate(`/heavy_tanks/${tank_id}`, { replace: true });
            }
            case EGamerRole.middleTankGunner:
            case EGamerRole.middleTankMeh: {
               return navigate(`/middle_tanks/${tank_id}`, { replace: true });
            }
            default: {
               return;
            }
         }
      }
   };
};
