import { cn } from '@/lib/utils'

interface AdminFormFieldProps {
    label: string
    required?: boolean
    error?: string
    children: React.ReactNode
    hint?: string
}

export function AdminFormField({ label, required, error, children, hint }: AdminFormFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
}
export function AdminInput({ className, error, ...props }: InputProps) {
    return (
        <input
            className={cn(
                'w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border rounded-lg outline-none transition-colors',
                error
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400',
                className
            )}
            {...props}
        />
    )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean
}
export function AdminTextarea({ className, error, ...props }: TextareaProps) {
    return (
        <textarea
            className={cn(
                'w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border rounded-lg outline-none transition-colors resize-y',
                error
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400',
                className
            )}
            {...props}
        />
    )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean
    options: { value: string; label: string }[]
}
export function AdminSelect({ className, error, options, ...props }: SelectProps) {
    return (
        <select
            className={cn(
                'w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border rounded-lg outline-none transition-colors',
                error
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400',
                className
            )}
            {...props}
        >
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    )
}
