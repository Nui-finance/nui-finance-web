import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getUsdRateByPoolType } from 'sui-api-final-v2';

export type RateInfo = {
  stakeCoinUsdRate: string;
  stakeCoinName: string;
};

type UseGetUsdRateProps = {
  poolType: string;
} & Omit<UseQueryOptions<RateInfo>, 'queryKey' | 'queryFn'>;

const useGetUsdRate = ({ poolType }: UseGetUsdRateProps) => {
  const queryFn = async () => {
    const rateInfo = await getUsdRateByPoolType(poolType);
    return rateInfo;
  };

  return useQuery<RateInfo>({
    queryFn,
    queryKey: ['usd', { poolType }],
    enabled: !!poolType,
  });
};

export default useGetUsdRate;
