import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./style/reset.css";
import "./style/variables.css";
import "./style/global.css";

import { AddressProvider } from "./context/AddressProvider.jsx";
import Page from "./components/Layout/Page/Page.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AddressProvider>
      <Page />
    </AddressProvider>
  </StrictMode>
);
