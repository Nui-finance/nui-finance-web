import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { PoolTypeEnum, getClaimedRewardInfo } from 'sui-api-final-v2';
import useGetPoolList from './use-get-pool-list';
import { poolCoin } from 'applications/constants';

type WinnerHistory = {
  poolType: PoolTypeEnum;
  claimedRewardMap: Map<
    string,
    {
      rewardAmount: string;
      winner: string;
    }
  >;
};

type Winner = {
  poolType: PoolTypeEnum;
  round: string;
  reward: string;
  coinName: string;
  address: string;
};

type UseGetWinnerHistoryOptions = Omit<
  UseQueryOptions<Winner[]>,
  'queryKey' | 'queryFn'
>;

const mappedRewardToken = (type) => {
  switch (type) {
    case PoolTypeEnum.BUCKET_PROTOCOL:
      return 'SUI';
    case PoolTypeEnum.SCALLOP_PROTOCOL:
      return 'SCA';
    case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
      return 'SUI';
    default:
      return null;
  }
};

const useGetWinnerHistory = (options?: UseGetWinnerHistoryOptions) => {
  const { data: poolList } = useGetPoolList();
  return useQuery<Winner[]>({
    queryKey: [
      'winner-history',
      ...(poolList?.map((pool) => pool?.currentRound) ?? []),
    ],
    queryFn: async () => {
      const winnerHistory = await Promise.all(
        poolList.map(async (pool) => ({
          poolType: pool.poolType,
          ...(await getClaimedRewardInfo(
            pool.claimedRewardInfoId,
            [],
            Number(pool.currentRound),
            pool.poolType,
          )),
        })),
      );
      const winners = winnerHistory?.flatMap((history) => {
        const _winners = [];
        history.claimedRewardMap.forEach((value, key) => {
          if (Number(value?.rewardAmount) > 0) {
            _winners.push({
              poolType: history.poolType,
              round: key,
              reward: value.rewardAmount,
              coinName: mappedRewardToken(history.poolType),
              address: value.winner,
            });
          }
        });
        return _winners;
      });
      return winners;
    },
    enabled: Array.isArray(poolList) && poolList.length > 0,
    // refetchOnWindowFocus: true,
    ...options,
  });
};

export default useGetWinnerHistory;
