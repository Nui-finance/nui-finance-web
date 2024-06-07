import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { PoolTypeEnum, packAllocateRewardsTxb } from 'sui-api-final-v2';
import useInvalidateAllInfo from './use-invalidate-all-info';
import { useModal } from 'components/organism/modals';

type UseDrawLotteryProps = { poolType: PoolTypeEnum } & Parameters<
  typeof useSignAndExecuteTransactionBlock
>[0];

const useDrawLottery = ({ poolType, ...options }: UseDrawLotteryProps) => {
  const { mutateAsync: invalidateAllInfo } = useInvalidateAllInfo();
  const { errorPopup } = useModal();
  const mutation = useSignAndExecuteTransactionBlock({
    ...options,
    onSuccess: (result, variables, context) => {
      invalidateAllInfo();
      options.onSuccess?.(result, variables, context);
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
      if (error?.message.includes('Rejected from user')) {
        return;
      } else {
        console.error(error);
        errorPopup();
      }
    },
  });
  const mutate = async (poolId) => {
    const txb = await packAllocateRewardsTxb(poolId);
    try {
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
    } catch (e) {
      throw e;
    }
  };
  return {
    ...mutation,
    mutate,
    mutateAsync: mutate,
  };
};

export default useDrawLottery;
