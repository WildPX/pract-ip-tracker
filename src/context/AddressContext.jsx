import { createContext, useContext } from "react";

export const AddressContext = createContext({});

export const useAddress = () => useContext(AddressContext);
