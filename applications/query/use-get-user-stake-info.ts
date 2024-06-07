import { useCurrentAccount } from '@mysten/dapp-kit';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { Pool } from 'applications/type';
import { getUserStakeInfo } from 'sui-api-final-v2';
import { roundNumber } from 'utils';

type UserStakeInfo = {
  stakeCoinName: string;
  userStakeTotalAmount: number;
  luckRate: number;
  userTicketList: {
    stakeShareId: string;
    startNum: string;
    endNum: string;
  }[];
};

type UseGetUserStakeInfoProps = {
  pool: Pool;
} & Omit<UseQueryOptions<UserStakeInfo>, 'queryKey' | 'queryFn'>;

const useGetUserStakeInfo = ({ pool }: UseGetUserStakeInfoProps) => {
  const account = useCurrentAccount();
  const queryFn = async () => {
    const stakeInfo = await getUserStakeInfo(
      account?.address,
      pool.poolType,
      pool.statistics.totalDeposit,
    );
    return {
      ...stakeInfo,
      userStakeTotalAmount: roundNumber(stakeInfo?.userStakeTotalAmount, 3),
    };
  };

  return useQuery<UserStakeInfo>({
    queryFn,
    queryKey: [
      'user-stake-info',
      account?.address,
      pool?.poolType,
      pool?.statistics?.totalDeposit,
    ],
    enabled: !!pool && !!account?.address,
    // refetchOnWindowFocus: true,
  });
};

export default useGetUserStakeInfo;
