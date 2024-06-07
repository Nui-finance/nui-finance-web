import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import { BucketCoinTypeEnum, packStakeTxb } from 'sui-api-final-v2';
import useInvalidateAllInfo from './use-invalidate-all-info';
import { useModal } from 'components/organism/modals';

type stakeProps = {
  poolId: string;
  stakeAmount: number;
  bucketStakeCoinType: BucketCoinTypeEnum;
};

const useStake = (
  options?: Parameters<typeof useSignAndExecuteTransactionBlock>[0],
) => {
  const account = useCurrentAccount();
  const { mutate: invalidateAllInfo } = useInvalidateAllInfo();
  const { errorPopup } = useModal();

  const mutation = useSignAndExecuteTransactionBlock({
    ...options,
    onSuccess: (result, variables, context) => {
      invalidateAllInfo();
      options?.onSuccess?.(result, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
      if (error?.message.includes('Rejected from user')) {
        return;
      } else {
        console.error(error);
        errorPopup();
      }
    },
  });

  const mutate = async ({
    poolId,
    stakeAmount,
    bucketStakeCoinType,
  }: stakeProps) => {
    const txb = await packStakeTxb(
      account?.address,
      poolId,
      stakeAmount,
      bucketStakeCoinType,
    );

    return mutation.mutate({
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
