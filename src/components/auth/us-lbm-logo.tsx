import Image from "next/image";

type UsLbmLogoProps = {
  className?: string;
  variant?: "default" | "hero";
};

/** Official U.S. LBM mark (`public/images/us-lbm-logo.png`). */
export function UsLbmLogo({
  className = "h-10 w-auto",
  variant = "default",
}: UsLbmLogoProps) {
  return (
    <Image
      src="/images/us-lbm-logo.png"
      alt="U.S. LBM"
      width={132}
      height={87}
      className={className}
      priority={variant === "hero"}
      sizes={variant === "hero" ? "120px" : "88px"}
    />
  );
}
