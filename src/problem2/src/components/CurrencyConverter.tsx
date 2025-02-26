import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Currency } from '../interfaces/currency'
import { mockData } from '../mock/mockData'
import TextInputWithSelect from './TextInputWithSelect'
import swap from '../assets/swap.svg'
import {
  INIT_CURRENCY_A,
  INIT_CURRENCY_B,
  INIT_VALUE_A,
} from '../constants/currencyConstants'
import { BeatLoader } from 'react-spinners'
import clsx from 'clsx'
import Decimal from 'decimal.js'

interface FormState {
  valueA?: string
  currencyA?: Currency | null
  valueB?: string
  currencyB?: Currency | null
}

function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [formState, setFormState] = useState<FormState>({})
  const [isLoading, setLoading] = useState<boolean>(true)

  const prevState = useRef<FormState>({})

  const convert = (
    amount: string | undefined,
    fromPrice: number | undefined,
    toPrice: number | undefined
  ) => {
    if (!amount || !fromPrice || !toPrice) return

    try {
      // Use Decimal.js for precise calculation
      const decimalAmount = new Decimal(amount)
      const decimalFromPrice = new Decimal(fromPrice)
      const decimalToPrice = new Decimal(toPrice)

      return decimalAmount
        .times(decimalFromPrice)
        .dividedBy(decimalToPrice)
        .toString()
    } catch (error) {
      console.error('Conversion error:', error)
      return undefined
    }
  }

  useEffect(() => {
    if (!prevState.current.currencyA && !prevState.current.currencyB) {
      prevState.current = formState
      return
    }

    if (isLoading) return

    const newState = { ...formState }

    if (
      prevState.current.valueA !== formState.valueA ||
      prevState.current.currencyA !== formState.currencyA
    ) {
      newState.valueB = convert(
        formState.valueA,
        formState.currencyA?.price,
        formState.currencyB?.price
      )
    } else if (
      prevState.current.valueB !== formState.valueB ||
      prevState.current.currencyB !== formState.currencyB
    ) {
      newState.valueA = convert(
        formState.valueB,
        formState.currencyB?.price,
        formState.currencyA?.price
      )
    }

    if (
      newState.valueA !== formState.valueA ||
      newState.valueB !== formState.valueB
    ) {
      setFormState(newState)
    }

    prevState.current = formState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formState.valueA,
    formState.valueB,
    formState.currencyA,
    formState.currencyB,
    isLoading,
  ])

  const fetchCurrencyData = useCallback(async (init = false) => {
    setLoading(true)

    try {
      // Mock a fetch API call
      const data = await new Promise<Currency[]>((resolve) => {
        setTimeout(() => resolve(mockData), 1000)
      })

      setCurrencies(data)

      if (init) {
        const initCurrencyA = data.find(
          (currency) => currency.symbol === INIT_CURRENCY_A
        )
        const initCurrencyB = data.find(
          (currency) => currency.symbol === INIT_CURRENCY_B
        )

        const initValueAString = INIT_VALUE_A.toString()
        const initialValueB = convert(
          initValueAString,
          initCurrencyA?.price,
          initCurrencyB?.price
        )

        setFormState({
          valueA: initValueAString,
          currencyA: initCurrencyA,
          currencyB: initCurrencyB,
          valueB: initialValueB,
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrencyData(true)
  }, [fetchCurrencyData])

  const handleValueChange = (field: 'valueA' | 'valueB', value: string) => {
    if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) return

    prevState.current = { ...formState }
    setFormState({ ...formState, [field]: value })
  }

  const handleCurrencyChange = (
    field: 'currencyA' | 'currencyB',
    selected: Currency | null
  ) => {
    prevState.current = { ...formState }

    // Swap A and B when the same currency is selected
    if (
      selected &&
      ((field === 'currencyA' && formState.currencyB?.id === selected.id) ||
        (field === 'currencyB' && formState.currencyA?.id === selected.id))
    ) {
      setFormState({
        valueA: formState.valueB,
        valueB: formState.valueA,
        currencyA: field === 'currencyA' ? selected : formState.currencyB,
        currencyB: field === 'currencyB' ? selected : formState.currencyA,
      })
    } else {
      setFormState({ ...formState, [field]: selected })
    }
  }

  const exchangeRate = useMemo(() => {
    if (!formState.currencyA?.price || !formState.currencyB?.price) {
      return ''
    }

    try {
      const rate = new Decimal(formState.currencyA.price)
        .dividedBy(new Decimal(formState.currencyB.price))
        .toDecimalPlaces(8)
        .toString()

      return `1 ${formState.currencyA.symbol} = ${rate} ${formState.currencyB.symbol}`
    } catch (error) {
      console.error('Exchange rate calculation error:', error)
      return ''
    }
  }, [
    formState.currencyA?.price,
    formState.currencyA?.symbol,
    formState.currencyB?.price,
    formState.currencyB?.symbol,
  ])

  return (
    <div className='flex flex-col border-2 border-border rounded-3xl lg:max-w-5xl max-w-xl min-w-sm w-full h-full p-10'>
      <div className='flex flex-col lg:flex-row justify-center items-center gap-4'>
        <TextInputWithSelect
          divider
          disabled={isLoading}
          inputProps={{
            value: formState.valueA,
            onChange: (e) =>
              handleValueChange('valueA', e.target.value),
          }}
          selectProps={{
            options: currencies,
            label: (option) => (
              <p>
                {option.name} ({option.symbol})
              </p>
            ),
            valueField: 'id',
            value: formState.currencyA,
            onChange: (selected) => handleCurrencyChange('currencyA', selected),
          }}
        />

        <div className='shrink-0 lg:rotate-90'>
          <img src={swap} alt='Description' width={24} height={24} />
        </div>

        <TextInputWithSelect
          divider
          disabled={isLoading}
          inputProps={{
            value: formState.valueB,
            onChange: (e) =>
              handleValueChange('valueB', e.target.value),
          }}
          selectProps={{
            options: currencies,
            label: (option) => (
              <p>
                {option.name} ({option.symbol})
              </p>
            ),
            valueField: 'id',
            value: formState.currencyB,
            onChange: (selected) => handleCurrencyChange('currencyB', selected),
          }}
        />
      </div>

      <div className=' flex flex-col lg:flex-row-reverse lg:justify-between lg:items-center gap-4 mt-4'>
        <button
          type='button'
          className={clsx(
            'border-2 border-border px-2.5 py-1.5 rounded-lg hover:bg-button-hover',
            isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
          onClick={() => fetchCurrencyData()}
          disabled={isLoading}
        >
          Refresh Price
        </button>
        {isLoading ? (
          <BeatLoader color='#e5dfec' size={12} />
        ) : (
          <span className='font-medium break-words'>{exchangeRate}</span>
        )}
      </div>
    </div>
  )
}

export default CurrencyConverter
