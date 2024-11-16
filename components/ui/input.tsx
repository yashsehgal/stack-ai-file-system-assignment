import { cn } from '@/lib/utils';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return <input className={cn('px-2 py-1 rounded-lg text-sm bg-neutral-100 hover:bg-neutral-100', className)} {...props} />;
}
