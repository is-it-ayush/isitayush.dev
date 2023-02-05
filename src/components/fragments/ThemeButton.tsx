import {Sun, Moon} from "lucide-react";
import {useTheme} from "next-themes";
import {useState, useEffect} from "react";

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
            className="flex rounded-full bg-black/10 p-2 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20">
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    );
};
