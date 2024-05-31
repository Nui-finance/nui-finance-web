import { useCurrentAccount } from '@mysten/dapp-kit';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { Pool, UserStakeInfo } from 'applications/type';
import { getUsdRateByPoolType, getUserStakeInfo } from 'sui-api-final-v2';
import useGetPoolList from './use-get-pool-list';
import { RateInfo } from './use-get-usd-rate';
import { roundNumber } from 'utils';

type UseGetAllPositionProps = Omit<
  UseQueryOptions<(UserStakeInfo & RateInfo)[]>,
  'queryKey' | 'queryFn'
>;

const useGetAllPosition = (options?: UseGetAllPositionProps) => {
  const account = useCurrentAccount();
  const { data: pools } = useGetPoolList();
  return useQuery<(UserStakeInfo & RateInfo)[]>({
    queryKey: [
      'all-position',
      account?.address,
      ...(pools?.map((pool) => pool?.statistics?.totalDeposit) ?? []),
    ],
    queryFn: async () => {
      const allPosition = await Promise.all(
        pools?.map(async (pool: Pool) => {
          const userStakeInfo = await getUserStakeInfo(
            account?.address,
            pool.poolType,
            pool.statistics.totalDeposit,
          );
          const rateInfo = await getUsdRateByPoolType(pool.poolType);
          return {
            ...userStakeInfo,
            userStakeTotalAmount: roundNumber(
              userStakeInfo?.userStakeTotalAmount,
              3,
            ),
            ...rateInfo,
          };
        }),
      );
      return allPosition;
    },
    ...options,
  });
};

export default useGetAllPosition;
