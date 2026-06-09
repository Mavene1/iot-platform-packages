export function AppFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-light)] bg-white">
      <div className="flex h-[var(--footer-height)] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
            Global Service Level: <span className="text-[var(--green-600)]">99.99%</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
            Region: <span className="text-primary">Africa-East-1 (NBO)</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="cursor-pointer text-[10px] font-bold uppercase tracking-wide text-secondary hover:text-[var(--green-600)]"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="cursor-pointer text-[10px] font-bold uppercase tracking-wide text-secondary hover:text-[var(--green-600)]"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
