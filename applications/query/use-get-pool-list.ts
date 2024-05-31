import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { Pool } from 'applications/type';
import { PoolTypeEnum, getPoolInfo, getPoolRewardInfo } from 'sui-api-final-v2';
import { roundNumber } from 'utils';

/**
 *
 * @returns pool list current round info for homepage display
 */

type UseGetPoolListProps = { poolType?: PoolTypeEnum } & Omit<
  UseQueryOptions<Pool[]>,
  'queryKey' | 'queryFn'
>;

const useGetPoolList = (params?: UseGetPoolListProps) => {
  const poolType = params?.poolType;
  const options = params ? { ...params } : {};
  const queryFn = async () => {
    const poolInfo = await getPoolInfo(poolType ? poolType : null);
    return await Promise.all(
      poolInfo?.poolList.map(async (pool: Pool) => {
        const result = await getPoolRewardInfo(pool.poolType);
        return {
          ...pool,
          ...result,
          statistics: {
            ...pool.statistics,
            totalDeposit: roundNumber(pool.statistics.totalDeposit, 2),
          },
        };
      }),
    );
  };

  return useQuery<Pool[]>({
    queryKey: ['pool-info', poolType],
    queryFn,
    // refetchOnWindowFocus: true,
    staleTime: Infinity,
    ...options,
  });
};

export default useGetPoolList;
