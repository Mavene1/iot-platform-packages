import { Dialog } from "radix-ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "cmdk";
import { useEffect } from "react";
import { DynamicIcon } from "./icons";
import type { CommandPaletteProps } from "./types";

export function CommandPalette({
  open,
  onOpenChange,
  nav,
  onNavigate,
}: CommandPaletteProps) {
  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  function navigate(href: string) {
    onOpenChange(false);
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.href = href;
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border border-[var(--border-light)] bg-background p-0 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search for services, pages, and actions.
          </Dialog.Description>
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-2 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput
              placeholder="Search services, pages..."
              className="flex h-12 w-full rounded-md bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-b border-[var(--border-light)]"
            />
            <CommandList className="max-h-[380px] overflow-y-auto overflow-x-hidden p-1">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </CommandEmpty>

              <CommandGroup
                heading="Platform"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {nav.platformNav.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.label}
                    onSelect={() => navigate(item.href)}
                    className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-[var(--surface-secondary)] data-[disabled=true]:opacity-50"
                  >
                    <DynamicIcon name={item.icon} className="mr-2 h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator className="my-1 h-px bg-[var(--border-light)]" />

              {nav.categories.map((category) => (
                <CommandGroup key={category.id} heading={category.label}>
                  {category.items.map((item) => (
                    <CommandItem
                      key={item.href}
                      value={`${item.label} ${item.description ?? ""}`}
                      onSelect={() => navigate(item.href)}
                      className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-[var(--surface-secondary)] data-[disabled=true]:opacity-50"
                    >
                      <DynamicIcon
                        name={item.icon ?? category.icon}
                        className="mr-2 h-4 w-4 text-muted-foreground"
                      />
                      <span>{item.label}</span>
                      {item.description && (
                        <span className="ml-auto truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}

              {nav.accountItems && nav.accountItems.length > 0 && (
                <>
                  <CommandSeparator className="my-1 h-px bg-[var(--border-light)]" />
                  <CommandGroup heading="Account">
                    {nav.accountItems.map((item) => (
                      <CommandItem
                        key={item.href}
                        value={item.label}
                        onSelect={() => navigate(item.href)}
                        className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-[var(--surface-secondary)] data-[disabled=true]:opacity-50"
                      >
                        <DynamicIcon name={item.icon} className="mr-2 h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
