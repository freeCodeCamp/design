import React, { forwardRef, useEffect, useId, useState } from 'react';

export interface ListboxItem {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export type ListboxSelectionMode = 'single' | 'multiple';

export type ListboxValue = string | string[] | null;

export interface ListboxProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  'onChange'
> {
  items: ListboxItem[];
  value?: string | string[] | null;
  selectionMode?: ListboxSelectionMode;
  onValueChange?: (value: string | string[]) => void;
}

function isSelected(
  itemValue: string,
  selectionMode: ListboxSelectionMode,
  value: ListboxValue
): boolean {
  if (value == null) return false;
  if (selectionMode === 'multiple') {
    return Array.isArray(value) && value.includes(itemValue);
  }
  return typeof value === 'string' && value === itemValue;
}

export const Listbox = forwardRef<HTMLUListElement, ListboxProps>(
  (
    {
      items,
      value = null,
      selectionMode = 'single',
      onValueChange,
      className = '',
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const classes = ['listbox', className].filter(Boolean).join(' ');
    const multi = selectionMode === 'multiple';
    const listId = useId();
    const [active, setActive] = useState<string | null>(null);
    const enabled = items.filter(item => !item.disabled);
    const focusedValue =
      active ?? (typeof value === 'string' ? value : null) ?? enabled[0]?.value;
    const activeIndex = items.findIndex(
      item => item.value === focusedValue && !item.disabled
    );
    useEffect(() => {
      const option = document.getElementById(`${listId}-${activeIndex}`);
      if (option?.parentElement === document.activeElement) {
        option.scrollIntoView?.({ block: 'nearest' });
      }
    }, [activeIndex, listId]);
    const pick = (itemValue: string): void => {
      if (!onValueChange) return;
      if (multi) {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(itemValue)
          ? current.filter(v => v !== itemValue)
          : [...current, itemValue];
        onValueChange(next);
      } else {
        onValueChange(itemValue);
      }
    };
    return (
      <ul
        ref={ref}
        className={classes}
        role='listbox'
        tabIndex={0}
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        onKeyDown={event => {
          const { key } = event;
          onKeyDown?.(event);
          if (event.defaultPrevented || !enabled.length) return;
          const current = enabled.findIndex(
            item => item.value === focusedValue
          );
          let next = current;
          if (key === 'ArrowDown') next = (current + 1) % enabled.length;
          else if (key === 'ArrowUp')
            next = (current - 1 + enabled.length) % enabled.length;
          else if (key === 'Home') next = 0;
          else if (key === 'End') next = enabled.length - 1;
          else if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            if (activeIndex >= 0) pick(items[activeIndex]!.value);
            return;
          } else return;
          event.preventDefault();
          setActive(enabled[next]!.value);
        }}
        aria-multiselectable={multi ? true : undefined}
        {...rest}
      >
        {items.map((item, index) => {
          const selected = isSelected(item.value, selectionMode, value);
          return (
            <li
              key={item.value}
              role='option'
              id={`${listId}-${index}`}
              data-highlighted={activeIndex === index ? '' : undefined}
              className='listbox__option'
              data-part='option'
              data-value={item.value}
              aria-selected={selected}
              aria-disabled={item.disabled ? true : undefined}
              onClick={
                item.disabled
                  ? undefined
                  : () => {
                      setActive(item.value);
                      pick(item.value);
                    }
              }
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    );
  }
);
Listbox.displayName = 'Listbox';
