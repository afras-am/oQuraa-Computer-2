import logo from "@/assets/oquraa-computer-logo.png.asset.json";
import { cn } from "@/lib/utils";

/** Official logo. Shown unmodified on its native black plate in both themes. */
export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <span className={cn("logo-plate inline-flex items-center rounded-md px-1.5 py-1", className)}>
      <img
        src={logo.url}
        alt="OQURAA COMPUTER"
        width={1874}
        height={478}
        className={cn("h-7 w-auto md:h-8", imgClassName)}
        decoding="async"
      />
    </span>
  );
}
