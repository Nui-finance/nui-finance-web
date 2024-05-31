import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import useInvalidateAllInfo from './use-invalidate-all-info';
import { PoolTypeEnum, packWithdrawTxb } from 'sui-api-final-v2';
import { useErrorPopup } from 'components/molecule/error-popup';

type UseWithdrawProps = {
  poolType: PoolTypeEnum;
} & Parameters<typeof useSignAndExecuteTransactionBlock>[0];

const useWithdraw = ({ poolType, ...options }: UseWithdrawProps) => {
  const { mutate: invalidateAllInfo } = useInvalidateAllInfo();
  const account = useCurrentAccount();
  const { errorPopup } = useErrorPopup();
  const mutation = useSignAndExecuteTransactionBlock({
    ...options,
    onSuccess: (result, variables, context) => {
      options?.onSuccess?.(result, variables, context);
      console.info(result);
      invalidateAllInfo();
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
      errorPopup();
      console.error(error);
    },
  });
  const mutate = async ({ withdrawAmount }) => {
    const txb = await packWithdrawTxb(
      account?.address,
      poolType,
      withdrawAmount,
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

export default useWithdraw;
