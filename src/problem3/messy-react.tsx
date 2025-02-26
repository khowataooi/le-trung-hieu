// This is the original code block provided for problem 3 with added comment
// For refactored version, visit ./cleaned-up-react.tsx

interface WalletBalance {
  currency: string
  amount: number
}
// Incomprehensive type, this should extends from WalletBalance
interface FormattedWalletBalance {
  currency: string
  amount: number
  formatted: string
}
// Redundant type define, Props is identical to BoxProps
interface Props extends BoxProps {}
// Component not exported, can't actually be used
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props
  const balances = useWalletBalances()
  const prices = usePrices()

  // Avoid the use of type any, should provide better typing
  const getPriority = (blockchain: any): number => {
    // Magic number, should move to a constant
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // Unused var
        // WalletBalance type is missing the blockchain property
        const balancePriority = getPriority(balance.blockchain)
        // No variable named lhsPriority defined, probably trying to use balancePriority
        if (lhsPriority > -99) {
          // Redundant if nesting, can move this condition to outer if block
          // Inverted filter logic, this is filtering out positive balances, leaving negative balances
          if (balance.amount <= 0) {
            return true
          }
        }
        // Can just return using the condition of previous ifs for comprehension
        return false
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        // Redundant comparison logic, simplified to rightPriority - leftPriority
        if (leftPriority > rightPriority) {
          return -1
        } else if (rightPriority > leftPriority) {
          return 1
        }
      })

    // prices is not used in this useMemo
  }, [balances, prices])

  // Unused var
  // Should merge sortedBalances and formattedBalances to a singular variable since sortedBalances served no other purpose
  // Complex variable compute not memoized, should use useMemo
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    }
  })

  // Incorrect data used, should use formattedBalances from above
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount
      return (
        <WalletRow
          className={classes.row}
          // Use property of balance for unique key instead of index
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    }
  )

  return <div {...rest}>{rows}</div>
}
