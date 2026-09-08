type Props = {
  text: string;
  color: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-9 w-9 text-[10px]",
  md: "h-12 w-12 text-xs",
  lg: "h-16 w-16 text-sm",
};

export function CompanyLogo({ text, color, size = "sm" }: Props) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md font-bold text-white ${sizes[size]}`}
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  );
}
