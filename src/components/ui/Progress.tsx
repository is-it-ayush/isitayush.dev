import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@src/lib/utils";

const ProgressStyles = cva("h-full w-full flex-1 transition-all rounded-full", {
    variants: {
        state: {
            default: "bg-black dark:bg-white",
        },
        indeterminate: {
            true: "w-[50%] animate-indeterminate relative top-0 left-0",
            false: "",
        },
        thickness: {
            medium: "h-2",
            small: "h-1",
        },
    },
    defaultVariants: {
        state: "default",
        indeterminate: false,
        thickness: "medium",
    },
});

interface ProgressProps
    extends React.ComponentPropsWithRef<typeof ProgressPrimitive.Root>,
        VariantProps<typeof ProgressStyles> {}


const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>((props, ref) => {
    const {state, thickness, indeterminate, className, value, ...rest} = props;

    return (

            <ProgressPrimitive.Root
                ref={ref}
                className={cn("relative w-full overflow-hidden bg-[#ffffee] dark:bg-[#1a1a1a]", className)}
                {...rest}>
                <ProgressPrimitive.Indicator
                    className={cn(
                        ProgressStyles({
                            state,
                            thickness,
                            indeterminate,
                        }),
                        ""
                    )}
                    style={{
                        transform: !indeterminate ? `translateX(-${100 - (value || 0)}%)` : ``,
                    }}
                />
            </ProgressPrimitive.Root>
    );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export {Progress};
