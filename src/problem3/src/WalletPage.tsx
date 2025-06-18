import { useMemo } from 'react';
import { Box, type BoxProps } from '@mui/material';

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis': return 100;
    case 'Ethereum': return 50;
    case 'Arbitrum': return 30;
    case 'Zilliqa':
    case 'Neo': return 20;
    default: return -99;
  }
};

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// interface Props extends BoxProps {}

const WalletPage: React.FC<BoxProps> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances() || [];
  const prices = usePrices() || {};

  const sortedBalances = useMemo(() => {
    return balances
      .filter(balance => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => 
        getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      );
  }, [balances]);

  const rows = useMemo(() => {
    return sortedBalances.map(balance => {
      const formatted: FormattedWalletBalance = {
        ...balance,
        formatted: balance.amount.toFixed()
      };
      const usdValue = prices[balance.currency] * balance.amount || 0;

      return (
        <WalletRow
          key={balance.currency}
          className={classes.row}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formatted.formatted}
        />
      );
    });
  }, [sortedBalances, prices]);

  return (
    <Box {...rest}>
      {rows}
    </Box>
  );
};

export default WalletPage;
