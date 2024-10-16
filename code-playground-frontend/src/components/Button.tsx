import React from "react";
import { Button as NextUIButton, ButtonProps } from "@nextui-org/button";

const Button: React.FC<ButtonProps> = props => {
  return (
    <NextUIButton
      {...props}
      className={`bg-red-800 text-white font-medium ${props.className || ""}`}
    />
  );
};

export default Button;
