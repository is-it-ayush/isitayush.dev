import {ReactNode} from "react";
import {ClassValue, clsx} from "clsx";
export const Container = ({
    children,
    className,
    row = false,
    ...props
}: {
    children: ReactNode;
    className?: ClassValue;
    row?: boolean;
}) => {
    return (
        <div
            className={clsx(
                "flex border-2 border-gray-300 dark:border-white/10 p-5 hover:bg-black hover:text-white dark:hover:text-black dark:hover:bg-white transition-colors duration-150",
                row ? "flex-row" : "flex-col",
                className
            )}>
            {children}
        </div>
    );
};
