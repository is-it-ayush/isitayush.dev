import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
export const Container = ({
  children,
  className,
  row = false,
  hover = true,
  padding = true,
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
        'flex rounded-[10px] transition-colors duration-200',
        row ? 'flex-row' : 'flex-col',
        hover ? 'hover:bg-black/5 dark:hover:bg-white/5' : '',
        padding ? 'p-5' : '',
        className,
      )}
    >
      {children}
    </div>
  );
};
