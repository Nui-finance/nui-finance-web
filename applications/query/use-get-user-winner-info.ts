import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { Pool, UserStakeInfo } from 'applications/type';
import { getUserWinnerInfo } from 'sui-api-final-v2';
import useGetUserStakeInfo from './use-get-user-stake-info';
import { useCurrentAccount } from '@mysten/dapp-kit';

export type UserWinnerInfo = {
  winnerInfoList: {
    round: string;
    luckNum: string;
    stakeShareId: string;
    expireTime: string;
  }[];
};

type UseGetUserWinnerInfoProps = {
  pool: Pool;
} & Omit<
  UseQueryOptions<UserWinnerInfo & UserStakeInfo>,
  'queryKey' | 'queryFn'
>;

const useGetUserWinnerInfo = ({ pool }: UseGetUserWinnerInfoProps) => {
  const { data: userStakeInfo } = useGetUserStakeInfo({
    pool,
  });
  const account = useCurrentAccount();
  const queryFn = async () => {
    return {
      ...(await getUserWinnerInfo(
        pool.poolId,
        pool.currentRound,
        pool.claimedRewardInfoId,
        userStakeInfo.userTicketList,
      )),
      ...userStakeInfo,
    };
  };

  return useQuery<UserWinnerInfo & UserStakeInfo>({
    queryFn,
    queryKey: ['user-winner-info', pool?.currentRound, account?.address],
    // staleTime: Infinity,
    enabled:
      !!pool?.poolId && !!account?.address && !!userStakeInfo?.userTicketList,
    // refetchOnWindowFocus: true,
  });
};

export default useGetUserWinnerInfo;
