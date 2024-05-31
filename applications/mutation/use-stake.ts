import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import { packStakeTxb } from 'sui-api-final-v2';
import useInvalidateAllInfo from './use-invalidate-all-info';
import { useErrorPopup } from 'components/molecule/error-popup';

type stakeProps = {
  poolId: string;
  stakeAmount: number;
};

const useStake = (
  options?: Parameters<typeof useSignAndExecuteTransactionBlock>[0],
) => {
  const account = useCurrentAccount();
  const { mutate: invalidateAllInfo } = useInvalidateAllInfo();
  const { errorPopup } = useErrorPopup();

  const mutation = useSignAndExecuteTransactionBlock({
    ...options,
    onSuccess: (result, variables, context) => {
      invalidateAllInfo();
      options?.onSuccess?.(result, variables, context);
    },
    onError: (error) => {
      errorPopup();
      console.error(error);
    },
  });

  const mutate = async ({ poolId, stakeAmount }: stakeProps) => {
    const txb = await packStakeTxb(account?.address, poolId, stakeAmount);

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
  };
};

export default useStake;
