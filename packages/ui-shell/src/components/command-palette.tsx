"use client";

import { useCommandPalette } from "../hooks/use-command-palette";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../primitives/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../primitives/command";
import { DynamicIcon } from "../utils/icons";
import { drawerCategories, drawerPlatformNavItems } from "../config/nav";

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  useCommandPalette(onOpenChange);

  const navigate = (href: string) => {
    onOpenChange(false);
    window.location.href = href;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 max-w-lg">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search for services, pages, and actions.
        </DialogDescription>
        <Command>
          <CommandInput placeholder="Search services, pages..." />
          <CommandList className="max-h-[380px]">
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Platform">
              {drawerPlatformNavItems.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                >
                  <DynamicIcon
                    name={item.icon}
                    className="mr-2 h-4 w-4 text-muted-foreground"
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {drawerCategories.map((category) => (
              <CommandGroup key={category.id} heading={category.label}>
                {category.items.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`${item.label} ${item.description ?? ""}`}
                    onSelect={() => navigate(item.href)}
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
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
