import React from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";

const TooltipButton: React.FC<{
  children: React.ReactNode;
  isIconOnly?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  tooltip: string;
  className?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  size?: "sm" | "md" | "lg" | undefined;
}> = ({
  children,
  tooltip,
  isIconOnly = false,
  isDisabled = false,
  onClick,
  className = "",
  radius = "sm",
  size = "sm",
}) => {
  return (
    <Tooltip
      content={tooltip}
      className="text-white bg-zinc-900"
      classNames={{ arrow: "bg-zinc-900" }}
    >
      <Button
        isDisabled={isDisabled}
        isIconOnly={isIconOnly}
        onClick={onClick}
        variant="light"
        className={`text-white ${className}`}
        radius={radius}
        size={size}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default TooltipButton;
