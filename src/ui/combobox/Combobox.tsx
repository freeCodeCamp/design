import React, { forwardRef, useEffect, useId, useState } from 'react';

export interface ComboboxItem {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

/**
 * Sync-filter helper that matches Zag's default "contains" predicate on
 * each item's label. Non-string labels fall back to the `value` field
 * so custom renderers still filter sanely.
 */
export function filterItemsByLabel<T extends ComboboxItem>(
  items: T[],
  query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return items;
  return items.filter(item => {
    const label = typeof item.label === 'string' ? item.label : item.value;
    return label.toLowerCase().includes(q);
  });
}

export interface ComboboxProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  items: ComboboxItem[];
  value?: string | null;
  inputValue?: string;
  placeholder?: string;
  disabled?: boolean;
  /**
   * When true, render a `data-part="loading"` row instead of empty/items.
   * Useful during async fetches; pair with `useAsyncComboboxItems` for
   * debounce + cancellation.
   */
  loading?: boolean;
  /**
   * Render a `data-part="error"` row with this message. Takes priority
   * over the empty state so transient fetch errors surface clearly.
   */
  error?: React.ReactNode;
  /**
   * Message for the empty state. Rendered when `items.length === 0`
   * and we're not loading. Defaults to "No results".
   */
  emptyMessage?: React.ReactNode;
  /**
   * Message for the loading state. Defaults to "Loading…".
   */
  loadingMessage?: React.ReactNode;
  onValueChange?: (value: string) => void;
  onInputValueChange?: (inputValue: string) => void;
  renderItem?: (item: ComboboxItem) => React.ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      items,
      value = null,
      inputValue,
      placeholder,
      disabled,
      loading,
      error,
      emptyMessage,
      loadingMessage,
      onValueChange,
      onInputValueChange,
      renderItem,
      className = '',
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref
  ) => {
    const reactId = useId();
    const rootId = id ?? `combobox-${reactId}`;
    const listId = `${rootId}-listbox`;
    const [open, setOpen] = useState(false);
    const [activeValue, setActiveValue] = useState<string | null>(null);
    const [internalInput, setInternalInput] = useState('');
    const enabled = items.filter(item => !item.disabled);
    const activeIndex = items.findIndex(
      item => item.value === activeValue && !item.disabled
    );
    const expanded = open && !disabled;
    const updateInput = (text: string) => {
      setInternalInput(text);
      onInputValueChange?.(text);
    };
    const pick = (item: ComboboxItem) => {
      if (disabled || item.disabled || loading || error) return;
      onValueChange?.(item.value);
      updateInput(typeof item.label === 'string' ? item.label : item.value);
      setOpen(false);
      setActiveValue(null);
    };
    const classes = ['combobox', className].filter(Boolean).join(' ');
    const showLoading = Boolean(loading);
    const showError = !showLoading && error !== undefined && error !== null;
    const showEmpty = !showLoading && !showError && items.length === 0;
    useEffect(() => {
      if (expanded && !showLoading && !showError && activeIndex >= 0) {
        document
          .getElementById(`${listId}-${activeIndex}`)
          ?.scrollIntoView?.({ block: 'nearest' });
      }
    }, [expanded, showLoading, showError, activeIndex, listId]);
    return (
      <div ref={ref} id={rootId} className={classes} data-part='root' {...rest}>
        <input
          type='text'
          role='combobox'
          className='combobox__input'
          data-part='input'
          aria-autocomplete='list'
          aria-expanded={expanded}
          aria-activedescendant={
            expanded && !showLoading && !showError && activeIndex >= 0
              ? `${listId}-${activeIndex}`
              : undefined
          }
          aria-controls={listId}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          placeholder={placeholder}
          disabled={disabled}
          value={inputValue ?? internalInput}
          onChange={e => {
            updateInput(e.currentTarget.value);
            setActiveValue(null);
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={event => {
            const { key } = event;
            if (disabled) return;
            if (key === 'Escape' || key === 'Tab') {
              setOpen(false);
              setActiveValue(null);
              if (key === 'Escape') event.preventDefault();
              return;
            }
            if (key === 'Enter' && expanded && activeIndex >= 0) {
              event.preventDefault();
              pick(items[activeIndex]!);
              return;
            }
            if (
              !['ArrowDown', 'ArrowUp'].includes(key) ||
              loading ||
              error ||
              !enabled.length
            )
              return;
            event.preventDefault();
            const current = enabled.findIndex(
              item => item.value === activeValue
            );
            const next =
              key === 'ArrowDown'
                ? (current + 1) % enabled.length
                : current < 0
                  ? enabled.length - 1
                  : (current - 1 + enabled.length) % enabled.length;
            setActiveValue(enabled[next]!.value);
            setOpen(true);
          }}
          readOnly={inputValue !== undefined && !onInputValueChange}
        />
        <ul
          id={listId}
          role='listbox'
          hidden={!expanded}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className='combobox__list'
          data-part='listbox'
          aria-busy={showLoading ? true : undefined}
        >
          {showLoading && (
            <li
              className='combobox__item combobox__item--status'
              data-part='loading'
              role='option'
              aria-disabled='true'
              aria-selected='false'
            >
              {loadingMessage ?? 'Loading…'}
            </li>
          )}
          {showError && (
            <li
              className='combobox__item combobox__item--status'
              data-part='error'
              role='option'
              aria-disabled='true'
              aria-selected='false'
            >
              {error}
            </li>
          )}
          {showEmpty && (
            <li
              className='combobox__item combobox__item--status'
              data-part='empty'
              role='option'
              aria-disabled='true'
              aria-selected='false'
            >
              {emptyMessage ?? 'No results'}
            </li>
          )}
          {!showLoading &&
            !showError &&
            items.map((item, index) => {
              const selected = value === item.value;
              return (
                <li
                  key={item.value}
                  role='option'
                  id={`${listId}-${index}`}
                  data-highlighted={activeValue === item.value ? '' : undefined}
                  onMouseDown={event => event.preventDefault()}
                  className='combobox__item'
                  data-part='item'
                  data-value={item.value}
                  aria-selected={selected}
                  aria-disabled={disabled || item.disabled ? true : undefined}
                  onClick={
                    disabled || item.disabled ? undefined : () => pick(item)
                  }
                >
                  {renderItem ? renderItem(item) : item.label}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
);
Combobox.displayName = 'Combobox';
