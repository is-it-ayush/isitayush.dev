import {Technologies, stack} from "@src/lib/utils";
import {ClassValue} from "clsx";
import Link from "next/link";

export const Tag = ({tag, className}: {tag: keyof Technologies; className?: ClassValue}) => {
    if (!Object.keys(stack).includes(tag)) return null;

    return (
        <Link href={stack[tag].url} target="_blank">
            <span className="text-xs text-black/70 dark:text-white/70 flex font-light border-2 border-gray-300 dark:border-white/10 px-2 py-1">
                {stack[tag].name}
            </span>
        </Link>
    );
};
