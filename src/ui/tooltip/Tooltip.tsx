import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useState
} from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip = ({
  content,
  children,
  className = ''
}: TooltipProps) => {
  const classes = ['tip', className].filter(Boolean).join(' ');
  const id = useId();
  const [dismissed, setDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if ((!hovered && !focused) || dismissed) return;
    const dismiss = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') setDismissed(true);
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [hovered, focused, dismissed]);
  const trigger = isValidElement<React.HTMLAttributes<HTMLElement>>(
    children
  ) ? (
    cloneElement(children, {
      'aria-describedby': [children.props['aria-describedby'], id]
        .filter(Boolean)
        .join(' '),
      tabIndex: children.props.tabIndex ?? 0
    })
  ) : (
    <span tabIndex={0} aria-describedby={id}>
      {children}
    </span>
  );
  return (
    <span
      className={classes}
      data-dismissed={dismissed ? '' : undefined}
      onMouseEnter={() => {
        setHovered(true);
        setDismissed(false);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        setFocused(true);
        setDismissed(false);
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      {trigger}
      <span id={id} role='tooltip' className='tip__bubble'>
        {content}
      </span>
    </span>
  );
};
Tooltip.displayName = 'Tooltip';
