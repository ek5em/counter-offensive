import { useContext } from "react";
import { MediatorContext, ServerContext } from "../components";

export const useGlobalContext = () => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);
    return { server, mediator };
};
