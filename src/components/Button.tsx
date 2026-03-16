"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, type MotionProps } from "framer-motion";

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>;

interface ButtonProps extends NativeButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3a52]";
  
  const variantStyles = {
    primary: "bg-[--primary] text-white hover:bg-[--primary-light]",
    secondary: "bg-[--accent-charcoal] text-white hover:bg-[--grey-700]",
    outline: "border-2 border-[--primary] text-[--primary] hover:bg-[--primary] hover:text-white",
    ghost: "text-[--primary] hover:bg-[--grey-100]",
  };
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-base",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const motionProps: MotionProps = {
    whileHover: { scale: 1.05, boxShadow: "0 12px 30px rgba(26,58,82,0.18)" },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 320, damping: 18 },
  };
  
  return (
    <motion.button
      {...motionProps}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
