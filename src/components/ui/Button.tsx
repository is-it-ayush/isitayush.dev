import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@src/components/ui/Tooltip";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
}

export const Button = ({ tooltip, ...rest }: ButtonProps) => {
  return tooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button aria-label={tooltip} {...rest} />
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <button aria-label={tooltip} {...rest} />
  );
}
