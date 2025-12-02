/* eslint-disable @typescript-eslint/no-unused-vars */
import { Children } from "react";

interface ButtonProps {
  onClick: () => void; // This is the function you passed from App.tsx
  children: React.ReactNode;
   // This handles content inside the button (like the word "Connect")
className?:string}


const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    // 3. Attach the received 'onClick' prop to the button's event listener
    <button  onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;