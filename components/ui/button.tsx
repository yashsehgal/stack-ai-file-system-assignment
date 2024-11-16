import { TablerIcon } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { TABLER_ICON } from '@/constants/tabler';

export type ButtonSize = 'sm' | 'md';
export type ButtonVariant = 'default' | 'secondary' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  leftIcon?: TablerIcon;
  rightIcon?: TablerIcon;
  isLoading?: boolean;
  stretch?: boolean;
}

const BUTTON_ICON: Record<ButtonSize, { size: number; strokeWidth: number }> = {
  sm: { size: TABLER_ICON.SIZE_SMALL, strokeWidth: TABLER_ICON.STROKE },
  md: { size: TABLER_ICON.SIZE, strokeWidth: TABLER_ICON.STROKE_THICK },
} as const;

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 rounded-md gap-2 text-sm',
  md: 'px-4 py-1.5 rounded-lg gap-2.5 text-sm',
} as const;

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  default: 'text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 border-transparent',
  secondary: 'bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 font-medium border-neutral-200',
  ghost: 'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 font-medium',
} as const;

export function Button({
  className,
  children,
  leftIcon: LeftIcon = undefined,
  rightIcon: RightIcon = undefined,
  size = 'md',
  variant = 'default',
  stretch = false,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center truncate border select-none',
        BUTTON_SIZE[size],
        BUTTON_VARIANT[variant],
        stretch && 'w-full',
        className,
      )}
      {...props}>
      {LeftIcon && <LeftIcon {...BUTTON_ICON[size]} className="shrink-0" />}
      <span className="truncate">{children}</span>
      {RightIcon && <RightIcon {...BUTTON_ICON[size]} className="shrink-0" />}
    </button>
  );
}
