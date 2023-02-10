import {ReactNode} from "react";
import {ClassValue, clsx} from "clsx";
export const Container = ({
    children,
    className,
    row = false,
    hover = true,
    padding = true,
    border = true,
    ...props
}: {
    children: ReactNode;
    className?: ClassValue;
    row?: boolean;
    hover?: boolean;
    padding?: boolean;
    border?: boolean;
}) => {
    return (
        <div
            className={clsx(
                "flex",
                row ? "flex-row" : "flex-col",
                hover ? "hover:border-gray-400 dark:hover:border-white/20" : "",
                padding ? "p-5" : "",
                border ? "border-2 border-gray-300 dark:border-white/10" : "",
                className
            )}>
            {children}
        </div>
    );
};
