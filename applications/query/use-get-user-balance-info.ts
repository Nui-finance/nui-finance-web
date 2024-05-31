import { useCurrentAccount } from '@mysten/dapp-kit';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { Pool } from 'applications/type';
import { PoolTypeEnum, getUserBalanceInfo } from 'sui-api-final-v2';

type UserBalanceMap = Map<
  PoolTypeEnum,
  { stakeCoinName: string; totalBalance: number }
>;
type UseGetUserBalanceInfoProps = {
  pool: Pool;
} & Omit<UseQueryOptions<UserBalanceMap>, 'queryKey' | 'queryFn'>;

const useGetUserBalanceInfo = ({ pool }: UseGetUserBalanceInfoProps) => {
  const account = useCurrentAccount();
  const queryFn = async () => {
    return (await getUserBalanceInfo(account?.address, pool.poolType))
      .userBalanceMap;
  };

  return useQuery<UserBalanceMap>({
    queryFn,
    queryKey: [
      'user-balance-info',
      account?.address,
      pool?.statistics?.totalDeposit,
    ],
    enabled: !!pool && !!account?.address,
    refetchOnWindowFocus: true,
  });
};

export default useGetUserBalanceInfo;
