import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from 'react';

interface DropdownContextShape {
  open: boolean;
  setOpen: (next: boolean) => void;
  toggleId: string;
  menuId: string;
}

const Ctx = createContext<DropdownContextShape | null>(null);

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownRoot = ({ className = '', children, ...rest }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const openFromEnd = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleId = useId();
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const items = rootRef.current?.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([disabled]):not([aria-disabled="true"])'
    );
    items?.[openFromEnd.current ? items.length - 1 : 0]?.focus();
    openFromEnd.current = false;
    const onMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const classes = ['dropdown', className].filter(Boolean).join(' ');
  return (
    <Ctx.Provider value={{ open, setOpen, toggleId, menuId }}>
      <div
        ref={rootRef}
        className={classes}
        {...rest}
        onKeyDown={event => {
          const { key } = event;
          rest.onKeyDown?.(event);
          if (event.defaultPrevented) return;
          const items = [
            ...event.currentTarget.querySelectorAll<HTMLElement>(
              '[role="menuitem"]:not([disabled]):not([aria-disabled="true"])'
            )
          ];
          const index = items.indexOf(document.activeElement as HTMLElement);
          if (key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            document.getElementById(toggleId)?.focus();
          } else if (key === 'Tab') {
            setOpen(false);
          } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
            event.preventDefault();
            if (!open) {
              openFromEnd.current = key === 'ArrowUp' || key === 'End';
              setOpen(true);
              return;
            }
            const next =
              key === 'Home'
                ? 0
                : key === 'End'
                  ? items.length - 1
                  : key === 'ArrowDown'
                    ? (index + 1) % items.length
                    : (index - 1 + items.length) % items.length;
            items[next]?.focus();
          }
        }}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
};
DropdownRoot.displayName = 'Dropdown';

interface DropdownToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DropdownToggle = forwardRef<HTMLButtonElement, DropdownToggleProps>(
  ({ className = '', onClick, children, ...rest }, ref) => {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('Dropdown.Toggle must be used inside <Dropdown>');
    return (
      <button
        ref={ref}
        type='button'
        id={ctx.toggleId}
        className={['btn', className].filter(Boolean).join(' ')}
        aria-haspopup='menu'
        aria-expanded={ctx.open}
        aria-controls={ctx.menuId}
        onClick={e => {
          ctx.setOpen(!ctx.open);
          onClick?.(e);
        }}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
DropdownToggle.displayName = 'Dropdown.Toggle';

const DropdownMenu = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...rest }, ref) => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('Dropdown.Menu must be used inside <Dropdown>');
  if (!ctx.open) return null;
  return (
    <div
      ref={ref}
      id={ctx.menuId}
      role='menu'
      aria-labelledby={ctx.toggleId}
      className={['dropdown__menu', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
});
DropdownMenu.displayName = 'Dropdown.Menu';

export interface DropdownItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  as?: 'a' | 'button';
  onSelect?: () => void;
}

const DropdownItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  DropdownItemProps
>(
  (
    { active, as, className = '', onClick, onSelect, children, ...rest },
    ref
  ) => {
    const ctx = useContext(Ctx);
    const classes = ['dropdown__item', className].filter(Boolean).join(' ');
    const handleActivate = (e: React.SyntheticEvent) => {
      (onClick as ((e: React.SyntheticEvent) => void) | undefined)?.(e);
      onSelect?.();
      ctx?.setOpen(false);
      if (ctx) document.getElementById(ctx.toggleId)?.focus();
    };
    if ((as ?? (rest.href ? 'a' : 'button')) === 'button') {
      const { href: _href, ...buttonRest } =
        rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type='button'
          role='menuitem'
          tabIndex={-1}
          className={classes}
          aria-current={active ? 'true' : undefined}
          onClick={handleActivate as React.MouseEventHandler<HTMLButtonElement>}
          {...(buttonRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        role='menuitem'
        tabIndex={-1}
        className={classes}
        aria-current={active ? 'true' : undefined}
        onClick={handleActivate as React.MouseEventHandler<HTMLAnchorElement>}
        {...rest}
      >
        {children}
      </a>
    );
  }
);
DropdownItem.displayName = 'Dropdown.Item';

export const Dropdown = Object.assign(DropdownRoot, {
  Toggle: DropdownToggle,
  Menu: DropdownMenu,
  Item: DropdownItem
});
