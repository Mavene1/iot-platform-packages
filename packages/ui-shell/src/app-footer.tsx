import type { AppFooterProps } from "./types";

export function AppFooter({
  serviceLevel = "99.99%",
  region = "AFRICA-EAST-1 (NBO)",
  privacyUrl = "/privacy",
  termsUrl = "/terms",
}: AppFooterProps) {
  return (
    <footer className="border-t border-[var(--border-light)] bg-white">
      <div className="mx-auto flex h-10 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6 text-xs">
          <span className="text-muted-foreground">
            GLOBAL SERVICE LEVEL:{" "}
            <span className="font-semibold text-[var(--green-600)]">
              {serviceLevel}
            </span>
          </span>
          <span className="text-muted-foreground">
            REGION:{" "}
            <span className="font-semibold text-foreground">{region}</span>
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={privacyUrl}
            className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            PRIVACY POLICY
          </a>
          <a
            href={termsUrl}
            className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            TERMS OF SERVICE
          </a>
        </div>
      </div>
    </footer>
  );
}
