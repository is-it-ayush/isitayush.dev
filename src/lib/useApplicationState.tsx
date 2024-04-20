import { useContext, useState, createContext } from 'react';

export type Theme = 'dark' | 'light';
export type ApplicationState = {
  theme: Theme;
};
type ApplicationStateContext = [
  ApplicationState,
  (updatedState: Partial<ApplicationState>) => void,
];

const ApplicationStateContext = createContext<ApplicationStateContext | null>(
  null,
);

interface ApplicationStateProviderProps {
  children: React.ReactNode;
}
export const ApplicationStateProvider = ({
  children,
}: ApplicationStateProviderProps) => {
  // state holder
  const [appState, setAppState] = useState<ApplicationState>({
    theme: 'light',
  });

  // partial state setter
  function updateAppState(updatedState: Partial<ApplicationState>): void {
    setAppState((prev) => ({
      ...prev,
      ...updatedState,
    }));
  }

  return (
    <ApplicationStateContext.Provider value={[appState, updateAppState]}>
      {children}
    </ApplicationStateContext.Provider>
  );
};

export const useApplicationState = () => {
  const context = useContext(ApplicationStateContext);
  if (!context) {
    throw new Error(
      'useApplicationState must be used within an ApplicationStateProvider',
    );
  }
  return context;
};
