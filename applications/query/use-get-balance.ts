import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { poolCoinDecimal, poolCoinType } from 'applications/constants';
import { roundNumber } from 'utils';

type Balance = {
  raw: string;
  formatted: number;
  hasLittleAmount: boolean;
};

type useGetBalanceProps = {
  coinName?: string | null;
} & Omit<UseQueryOptions<unknown, Error, Balance>, 'queryKey' | 'queryFn'>;

const useGetBalance = ({ coinName, ...options }: useGetBalanceProps) => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  return useQuery<unknown, Error, Balance>({
    queryKey: ['balance', account?.address, poolCoinType[coinName]],
    queryFn: async () => {
      const data = await client.getBalance({
        owner: account?.address,
        coinType: poolCoinType[coinName],
      });

      return {
        raw: data.totalBalance,
        formatted: roundNumber(
          Number(data.totalBalance) / poolCoinDecimal[coinName],
          5,
        ),
        hasLittleAmount:
          0.01 > Number(data.totalBalance) / poolCoinDecimal[coinName] &&
          0 < Number(data.totalBalance) / poolCoinDecimal[coinName],
      };
    },
    enabled: !!account?.address,
    refetchOnMount: true,
    ...options,
  });
};

export default useGetBalance;
