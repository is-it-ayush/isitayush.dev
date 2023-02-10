import {ReactNode} from "react";
import {ClassValue, clsx} from "clsx";
export const Container = ({children, className, ...props}: {children: ReactNode; className?: ClassValue}) => {
    return (
        <div
            className={clsx(
                "flex flex-col border-2 border-gray-300 dark:border-white/10 p-5 hover:bg-black hover:text-white dark:hover:text-black dark:hover:bg-white transition-colors duration-150",
                className
            )}>
            {children}
        </div>
    );
};
