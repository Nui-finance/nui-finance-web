import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import { Pool } from 'applications/type';
import { packClaimRewardTxb, saveClaimDigest } from 'sui-api-final-v2';
import useInvalidateAllInfo from './use-invalidate-all-info';
import { useErrorPopup } from 'components/molecule/error-popup';
import { UserWinnerInfo } from 'applications/query/use-get-user-winner-info';

type UseClaimProps = {
  pool: Pool;
  winnerInfoList: UserWinnerInfo['winnerInfoList'];
} & Parameters<typeof useSignAndExecuteTransactionBlock>[0];

const useClaim = ({ pool, winnerInfoList, ...options }: UseClaimProps) => {
  const account = useCurrentAccount();
  const { mutate: invalidateAllInfo } = useInvalidateAllInfo();
  const { errorPopup } = useErrorPopup();
  const mutation = useSignAndExecuteTransactionBlock({
    ...options,
    onSuccess: (result, variables, context) => {
      options.onSuccess?.(result, variables, context);
      saveClaimDigest(pool.poolType, account?.address, result);
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
      errorPopup();
      console.error(error);
    },
    onSettled: () => {
      invalidateAllInfo();
    },
  });
  const canClaim = !!account?.address && winnerInfoList?.length > 0;

  const mutate = async () => {
    const txb = await packClaimRewardTxb(pool?.poolType, winnerInfoList);
    mutation.mutate({
      transactionBlock: txb,
      options: {
        showBalanceChanges: true,
        showEffects: true,
        showEvents: true,
        showInput: true,
        showObjectChanges: true,
        showRawInput: true,
      },
    });
  };
  return {
    ...mutation,
    mutate,
    mutateAsync: mutate,
    canClaim,
  };
};

export default useClaim;
