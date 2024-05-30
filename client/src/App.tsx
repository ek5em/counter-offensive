import { FC } from "react";
import { Modal, AppRouter, ContextProvider } from "./components";

import "./styles/global.scss";

const App: FC = () => {
    const useMock = Boolean(
        new URLSearchParams(window.location.search).get("useMock")
    );
    
    return (
        <ContextProvider useMock={useMock}>
            <Modal />
            <AppRouter />
        </ContextProvider>
    );
};

export default App;
