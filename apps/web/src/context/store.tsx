import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type MarkerData = [number | "", number | ""];

type GlobalContextValue = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  markerData: MarkerData;
  setMarkerData: Dispatch<SetStateAction<MarkerData>>;
  logout: () => void;
};

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>("");
  const [markerData, setMarkerData] = useState<MarkerData>(["", ""]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) {
      setUserId(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("userId", userId);
    }
  }, [userId, hydrated]);

  const logout = () => {
    setUserId("");
    localStorage.removeItem("userId");
  };

  return (
    <GlobalContext.Provider value={{ userId, setUserId, markerData, setMarkerData, logout }}>
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
