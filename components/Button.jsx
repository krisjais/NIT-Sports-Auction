'use client';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-semibold rounded transition-all duration-200 focus:outline-none';

  const variantStyles = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-400',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400',
    ghost: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-900',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
