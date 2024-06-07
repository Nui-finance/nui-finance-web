import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import useInvalidateAllInfo from './use-invalidate-all-info';
import { PoolTypeEnum, packWithdrawTxb } from 'sui-api-final-v2';
import { useModal } from 'components/organism/modals';

type UseWithdrawProps = {
  poolType: PoolTypeEnum;
} & Parameters<typeof useSignAndExecuteTransactionBlock>[0];

//buck
// > 1, -0.005
// > 0.1, -0.001
// > 0.01, -0.0005

const useWithdraw = ({ poolType, ...options }: UseWithdrawProps) => {
  const { mutate: invalidateAllInfo } = useInvalidateAllInfo();
  const account = useCurrentAccount();
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
  const mutate = async ({ withdrawAmount }) => {
    // const amount =
    //   poolType === PoolTypeEnum.BUCKET_PROTOCOL
    //     ? removeBias(withdrawAmount)
    //     : withdrawAmount;
    const txb = await packWithdrawTxb(
      account?.address,
      poolType,
      withdrawAmount,
      null,
    );
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

// function removeBias(amount: number) {
//   if (amount >= 1) {
//     return amount - 0.005;
//   } else if (amount >= 0.1) {
//     return amount - 0.001;
//   } else if (amount >= 0.01) {
//     return amount - 0.0001;
//   }
//   return amount;
// }

export default useWithdraw;
