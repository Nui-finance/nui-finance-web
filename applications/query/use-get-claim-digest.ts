import { useCurrentAccount } from '@mysten/dapp-kit';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { Pool } from 'applications/type';
import { getClaimDigestList } from 'sui-api-final-v2';

type UseGetClaimDigestProps = {
  pool: Pool;
} & Omit<UseQueryOptions<any[]>, 'queryKey' | 'queryFn'>;

const useGetClaimDigest = ({ pool }: UseGetClaimDigestProps) => {
  const account = useCurrentAccount();
  const queryFn = async () => {
    return (await getClaimDigestList(pool.poolType, account?.address))
      ?.digestList;
  };

  return useQuery<any[]>({
    queryFn,
    queryKey: [
      'user-claim-digest',
      account?.address,
      pool?.poolType,
      pool?.currentRound,
    ],
    staleTime: Infinity,
    enabled: !!pool?.poolType && !!pool?.currentRound && !!account?.address,
    // refetchOnWindowFocus: true,
  });
};

export default useGetClaimDigest;
