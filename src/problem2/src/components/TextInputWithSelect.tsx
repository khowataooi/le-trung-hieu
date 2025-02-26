import clsx from 'clsx'
import Select from './common/select/Select'
import { SelectProps } from './common/select/type'

interface Props<Option extends Record<string, unknown>> {
  className?: string
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
  selectProps: SelectProps<Option>
  divider?: boolean
  disabled?: boolean
}

function TextInputWithSelect<Option extends Record<string, unknown>>({
  className,
  inputProps,
  selectProps,
  divider = false,
  disabled,
}: Props<Option>) {
  return (
    <div
      className={clsx(
        'flex rounded-lg border-2 border-border hover:border-border-hover w-full',
        className
      )}
    >
      <input
        {...inputProps}
        disabled={disabled}
        value={inputProps.value ?? ''}
        className={clsx(
          'outline-none px-2 py-3 grow min-w-30 cursor-auto',
          disabled && '!cursor-not-allowed'
        )}
      />
      <div className='flex relative max-w-40 w-full'>
        {divider && (
          <div className='absolute top-2 bottom-2 border-l border-border' />
        )}
        <Select {...selectProps} disabled={disabled} />
      </div>
    </div>
  )
}

export default TextInputWithSelect
