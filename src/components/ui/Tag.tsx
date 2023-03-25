import {cn} from "@src/lib/utils";
import {ClassValue} from "clsx";
import {ReactNode} from "react";

export const Tag = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: ClassValue;
}) => {
  return (
    <span
      className={cn(
        "text-xs text-black/70 dark:text-white/70 flex font-light border-2 border-gray-300 dark:border-white/10 px-2 py-1",
        className
      )}>
      {children}
    </span>
  );
};
