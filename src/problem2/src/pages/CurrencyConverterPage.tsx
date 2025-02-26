import CurrencyConverter from '../components/CurrencyConverter'

function CurrencyConverterPage() {
  return (
    <div className='flex flex-col w-full min-h-dvh bg-background'>
      <section className='flex flex-col justify-center items-center p-5 gap-10 mt-10'>
        <h1 className='font-semibold text-3xl'>Cryptocurrency Converter</h1>
        <CurrencyConverter />
      </section>
    </div>
  )
}

export default CurrencyConverterPage
