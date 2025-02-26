import { useEffect, useRef, useState } from 'react'
import { SelectProps } from './type'
import chevron from '../../../assets/chevron-down.svg'
import clsx from 'clsx'

function Select<Option extends Record<string, unknown>>({
  options,
  label,
  valueField,
  value,
  onChange,
  disabled,
  placeholder = 'Select an option',
}: SelectProps<Option>) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Option | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current?.contains(event.target as Node) ||
        buttonRef.current?.contains(event.target as Node)
      ) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: Option) => {
    if (disabled) {
      setIsOpen(false)
      return
    }

    if (value === undefined) {
      setSelected(option)
    }
    setIsOpen(false)
    onChange?.(option)
  }

  return (
    <div className='relative grow min-w-20 whitespace-nowrap'>
      <button
        ref={buttonRef}
        className={clsx(
          'flex items-center h-full w-full p-2 text-left focus:outline-none overflow-hidden',
          disabled && '!cursor-not-allowed'
        )}
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className='grow'>{selected ? label(selected) : placeholder}</span>
        <span className={clsx('shrink-0', isOpen && 'rotate-180')}>
          <img src={chevron} width={20} height={20} />
        </span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute mt-1 p-2 border border-[#212d3b] bg-[#1b232d] rounded-xl shadow-lg overflow-hidden z-10 right-0'
        >
          <div className='overflow-x-hidden overflow-y-auto max-h-60'>
            {options.map((option) => (
              <div
                key={String(option[valueField])}
                className='p-2 hover:bg-[#212d3b] cursor-pointer rounded whitespace-nowrap'
                onClick={() => handleSelect(option)}
              >
                {label(option)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Select
