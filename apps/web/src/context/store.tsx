import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type MarkerData = [number | "", number | ""];

type GlobalContextValue = {
  markerData: MarkerData;
  setMarkerData: Dispatch<SetStateAction<MarkerData>>;
};

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [markerData, setMarkerData] = useState<MarkerData>(["", ""]);

  return (
    <GlobalContext.Provider value={{ markerData, setMarkerData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalContextProvider");
  }
  return context;
};
