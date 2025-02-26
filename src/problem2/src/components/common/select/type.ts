import { ReactNode } from 'react'

export interface SelectProps<Option extends Record<string, unknown>> {
  options: Option[]
  label: (selectedOption: Option) => string | ReactNode
  valueField: keyof Option
  value?: Option | null
  onChange?: (selected: Option | null) => void
  placeholder?: string
  disabled?: boolean
}
