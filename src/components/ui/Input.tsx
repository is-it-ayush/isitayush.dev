import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@src/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';

const InputStyles = cva(
  'flex h-10 w-full border border-black/10 dark:border-white/10 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none',
  {
    variants: {
      style: {
        base: 'text-gray-900 dark:text-gray-100 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:disabled:opacity-50',
        red: 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 text-red-900 dark:text-red-100 focus:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-red-400 dark:focus:ring-offset-red-900 dark:disabled:opacity-50',
      },
    },
    defaultVariants: {
      style: 'base',
    },
  },
);

interface InputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'style'>,
    VariantProps<typeof InputStyles> {
  type?: 'email' | 'number' | 'password' | 'text';
  error?: string;
}

export const Input = (props: InputProps) => {
  const { error, type = 'text', style, className, ...rest } = props;

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const getType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  return (
    <div className={cn('flex h-14 flex-col space-y-2', className)}>
      <div
        className={cn(
          error && error?.length > 0
            ? InputStyles({ style: 'red' })
            : InputStyles({ style }),
          'flex w-full flex-row',
        )}
      >
        <input
          className="w-full bg-transparent px-0 py-2 pr-2 outline-none ring-0 focus:outline-none focus:ring-0 "
          type={getType()}
          {...rest}
        />
        {type === 'password' ? (
          <Button
            tooltip={showPassword ? 'hide password.' : 'show password.'}
            className="flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-900"
            type="button"
            onClick={() => {
              toggleShowPassword();
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        ) : null}
      </div>
      {error && error.length > 0 && (
        <span className="text-xs text-red-900 dark:text-red-700">{error}</span>
      )}
    </div>
  );
};
