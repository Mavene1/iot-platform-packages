# State Management — Coding Rules

> Deep dive: `../../iot-unified-platform/docs/state-management.md`

## Context: library packages, not apps

These packages are React libraries distributed to child apps. The state management decision map from the shell applies here too, but several rules are not relevant:

| Situation | Applies here? | Notes |
|---|---|---|
| Table search + `ActiveFilter[]` + date range + pagination → `useTableFilter` | ✗ | No tables in these packages |
| Single open/close boolean → `useDisclosure` | ✓ | `ui-shell` has modal toggles |
| Row-action dialog + typed target → `useDialogTarget<T>` | ✗ | No row-action dialogs |
| 3+ filter fields that reset together → grouped `useState` | ✓ | Check for this in new code |
| 2 independent fields → separate `useState` fine | ✓ | Default case |
| Form fields → React Hook Form + Zod | ✗ | No forms in these packages |
| Complex atomic transitions → `useReducer` | ✓ | For wizard-like flows if added |
| Server data (loading, error, data) → TanStack Query | ✗ | Libraries should not bring TanStack Query as a dependency — keep manual fetch + Zustand |

## `useDisclosure` in ui-shell

Lives at `packages/ui-shell/src/hooks/ui/use-disclosure.ts`. **Not exported** from the package — internal use only. Apps have their own local copies.

Differs from the app version by adding `setOpen(v: boolean)`:

```ts
const { isOpen, onOpen, onClose, toggle, setOpen } = useDisclosure();
```

`setOpen` is needed because Radix-based primitives pass `onOpenChange: (boolean) => void`. Without it, you'd need a `(v) => v ? onOpen() : onClose()` adapter everywhere.

```ts
// AppNavbar — correct usage
const drawer = useDisclosure();
const cmdPalette = useDisclosure();

// open by direct action:
onClick={drawer.onOpen}

// wired to a Radix onOpenChange:
onOpenChange={drawer.setOpen}
```

## auth-client state patterns

`useIdleTimeout` uses 2 separate `useState` calls (`isWarning`, `secondsRemaining`) — this is fine per Rule 5 (2 independent fields). Although they reset together in handlers, they are only 2 fields (below the 3+ grouping threshold).

`AuthProvider` uses manual `setAuthLoading(true)` → fetch → `setUser()` → `setAuthLoading(false)`. **Do not replace with TanStack Query** — this package should not take on that dependency for a single session fetch.

`AppSidebar` uses `isCollapsed` + `ready` as separate `useState`. `isCollapsed` cannot use `useDisclosure` because it persists to `localStorage` and must sync `--sidebar-width` as a side effect. Keep as-is.

## Do NOT

- Export `useDisclosure` from ui-shell's index — consuming apps have their own copies in `hooks/ui/`
- Add TanStack Query as a dependency to auth-client — it's a library; one session fetch does not warrant the weight
- Use `useDisclosure` for `AppSidebar`'s `isCollapsed` — it has persistence side effects that `useDisclosure` does not handle
- Write 3+ separate `useState` for fields that reset together in one handler — group into one `useState` object with named `handle*` callbacks
- Write `useState(false)` for a new modal/dialog toggle in ui-shell components — use `useDisclosure`
