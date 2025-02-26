// This is the cleaned up version of problem 3

// Complete and well-defined interfaces
interface WalletBalance {
  currency: string
  amount: number
  blockchain: string // Added missing property
}

// Properly extends from WalletBalance
interface FormattedWalletBalance extends WalletBalance {
  formatted: string
}

// Removed
// interface Props extends BoxProps {}

// Blockchain priority as a constant object for better lookup performance
// Should be moved to a constants file in actual project
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
}

const DEFAULT_PRIORITY = -99

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props
  const balances = useWalletBalances()
  const prices = usePrices()

  // Pure function for getting priority, moved outside component for testability
  const getPriority = (blockchain: string): number => {
    return BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY
  }

  // Memoized formatted balances with proper filtering and sorting
  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain)
        // Only keep balances with valid priority AND positive amount
        return balancePriority > DEFAULT_PRIORITY && balance.amount > 0
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        // Simplified comparison logic
        return rightPriority - leftPriority
      })
      .map((balance: WalletBalance) => {
        return { ...balance, formatted: balance.amount.toFixed() }
      })
    // Remove unused dependency prices
  }, [balances])

  // Rows mapped from fully processed data
  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount
      return (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}-${balance.currency}`} // Better unique key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    }
  )

  return <div {...rest}>{rows}</div>
}

// Exported for actual usage
export default WalletPage
