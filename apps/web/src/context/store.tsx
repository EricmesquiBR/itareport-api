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
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  markerData: MarkerData;
  setMarkerData: Dispatch<SetStateAction<MarkerData>>;
  logout: () => void;
};

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [markerData, setMarkerData] = useState<MarkerData>(["", ""]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    if (storedUserId) setUserId(storedUserId);
    if (storedToken) setToken(storedToken);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      if (userId) {
        localStorage.setItem("userId", userId);
      } else {
        localStorage.removeItem("userId");
      }
    }
  }, [userId, hydrated]);

  useEffect(() => {
    if (hydrated) {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, [token, hydrated]);

  const logout = () => {
    setUserId("");
    setToken("");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  };

  return (
    <GlobalContext.Provider
      value={{ userId, setUserId, token, setToken, markerData, setMarkerData, logout }}
    >
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
