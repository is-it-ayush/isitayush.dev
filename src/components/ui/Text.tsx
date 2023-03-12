import {ReactNode} from "react";

import {cn} from "@src/lib/utils";
import Balancer from "react-wrap-balancer";

interface TextProps {
  children: ReactNode;
  heading?: boolean;
  headingSize?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  weight?:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  ratio?: number;
}

export const Text = ({
  children,
  heading = false,
  headingSize,
  className,
  size = "base",
  weight = "normal",
  ratio = heading ? 1 : 0,
}: TextProps) => {
  const sizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  }[size];

  const weightClass = {
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  }[weight];

  if (heading) {
    const Heading = headingSize || "h2";
    return (
      <Heading className={cn(sizeClass, weightClass, className)}>
        <Balancer ratio={ratio >= 0 && ratio <= 1 ? ratio : 1}>
          {children}
        </Balancer>
      </Heading>
    );
  }

  return (
    <p className={cn(sizeClass, weightClass, className)}>
      <Balancer ratio={ratio >= 0 && ratio <= 1 ? ratio : 1}>
        {children}
      </Balancer>
    </p>
  );
};
