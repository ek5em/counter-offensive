import { FC } from "react";
import { Modal, AppRouter } from "./components";

import "./styles/global.scss";
import { ContextProvider } from "./components/ContextProvider/ContextProvider";

const App: FC = () => {
  return (
    <ContextProvider>
      <Modal />
      <AppRouter />
    </ContextProvider>
  );
};

export default App;
