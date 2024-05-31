import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { PoolTypeEnum, packAllocateRewardsTxb } from 'sui-api-final-v2';
import useInvalidateAllInfo from './use-invalidate-all-info';
import { useErrorPopup } from 'components/molecule/error-popup';

type UseDrawLotteryProps = { poolType: PoolTypeEnum } & Parameters<
  typeof useSignAndExecuteTransactionBlock
>[0];

const useDrawLottery = ({ poolType, ...options }: UseDrawLotteryProps) => {
  const { mutate: invalidateAllInfo } = useInvalidateAllInfo();
  const { errorPopup } = useErrorPopup();
  const mutation = useSignAndExecuteTransactionBlock({
    ...options,
    onSuccess: (result, variables, context) => {
      options.onSuccess?.(result, variables, context);
      invalidateAllInfo();
    },
    onError: (error) => {
      errorPopup();
      console.error(error);
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
