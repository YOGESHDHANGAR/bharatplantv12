import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import MiniDrawer from "./components/layout/SidePanel/MiniDrawer";

const App = () => {
  return (
    <BrowserRouter>
      <MiniDrawer />
    </BrowserRouter>
  );
};

export default App;
