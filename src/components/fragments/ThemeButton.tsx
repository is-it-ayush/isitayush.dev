import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Text } from "@src/components/ui/Text";

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const adjust = (isDark: boolean) => {
      if (isDark) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };

    /**
     * A small hack by Tanner Linsley from his "Custom Hooks in React" JSConf talk. (2020)
     * Thanks Tanner! :)
     * https://youtu.be/J-g9ZJha8FE?t=360
     */
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    adjust(matchMedia.matches);

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        adjust(e.matches);
      });

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", (e) => {
          adjust(e.matches);
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When rendering client side don't display anything until you have confirmed the theme.
  // This prevents the wrong theme being loaded on first render.
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      className="">
      <Text size={"sm"} weight={"light"}>
        {theme === "dark" ? "light." : "dark."}
      </Text>
    </button>
  );
};
