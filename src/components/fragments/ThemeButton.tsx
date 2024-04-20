import { useEffect } from 'react';
import { Button } from '@src/components/ui/Button';
import type { Theme } from '@src/lib/useApplicationState';
import { useApplicationState } from '@src/lib/useApplicationState';

export const ThemeButton = () => {
  const [appState, setAppState] = useApplicationState();

  // initial render: get theme from localStorage or use system preference
  // to set the theme for the first time.
  useEffect(() => {
    if (!('localStorage' in window)) {
      return;
    }
    const theme = localStorage.getItem('theme') as Theme;
    if (theme) {
      setCurrentTheme(theme);
    } else {
      setCurrentTheme(getCurrentThemePreference());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update the theme class on the body if appState.theme changes.
  useEffect(() => {
    if (appState.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appState.theme]);

  // helper function to get the current theme preference from the system.
  function getCurrentThemePreference(): Theme {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  }

  // helper function to set the current theme in localStorage and appState.
  function setCurrentTheme(theme: Theme) {
    if ('localStorage' in window) {
      localStorage.setItem('theme', theme);
    }
    setAppState({ theme });
  }

  return (
    <Button
      tooltip={`switch to ${
        appState.theme === 'dark' ? 'light' : 'dark'
      } mode.`}
      onClick={() => {
        setCurrentTheme(appState.theme === 'dark' ? 'light' : 'dark');
      }}
      className=""
    >
      <span className="text-sm font-light">
        {appState.theme === 'dark' ? 'light.' : 'dark.'}
      </span>
    </Button>
  );
};
