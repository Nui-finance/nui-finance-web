import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { poolTypeByCoinName } from 'applications/constants';
import { getUsdRateByPoolType } from 'sui-api-final-v2';

export type RateInfo = {
  stakeCoinUsdRate: string;
  stakeCoinName: string;
};

type UseGetUsdRateProps = {
  coinName: string;
} & Omit<UseQueryOptions<RateInfo>, 'queryKey' | 'queryFn'>;

const useGetUsdRate = ({ coinName }: UseGetUsdRateProps) => {
  const queryFn = async () => {
    if (coinName === 'USDT' || coinName === 'USDC') {
      return {
        stakeCoinUsdRate: '1',
        stakeCoinName: coinName,
      };
    } else {
      const rateInfo = await getUsdRateByPoolType(poolTypeByCoinName[coinName]);
      return rateInfo;
    }
  };

  return useQuery<RateInfo>({
    queryFn,
    queryKey: ['usd', { coinName }],
    enabled: !!coinName,
  });
};

export default useGetUsdRate;
