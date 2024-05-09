import { privateRoutes, publicRoutes } from "../router";
import { useGlobalContext } from "./useGlobalContext";

export const useGetRouter = () => {
    const { mediator } = useGlobalContext();
    const { TOKEN } = mediator.getTriggerTypes();
    return () => {
        return mediator.get(TOKEN) ? privateRoutes : publicRoutes;
    };
};
