import {useTheme} from "next-themes";
import {useState, useEffect} from "react";
import {Text} from "@src/components/ui/Text";

export const ThemeButton = () => {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
