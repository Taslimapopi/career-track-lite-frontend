const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-surface border border-border text-ink hover:bg-background",
  danger: "bg-danger text-white hover:opacity-90",
  ghost: "text-ink hover:bg-surface",
};

export const buttonStyles = (variant = "primary", className = "") =>
  `inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium
   transition-all duration-200 active:scale-95
   disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
   ${VARIANTS[variant]} ${className}`;

const Button = ({ variant = "primary", className = "", children, ...props }) => (
  <button className={buttonStyles(variant, className)} {...props}>
    {children}
  </button>
);

export default Button;