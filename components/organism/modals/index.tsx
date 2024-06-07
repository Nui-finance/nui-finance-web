import { useDisclosure } from '@chakra-ui/react';
import { Pool } from 'applications/type';
import ResultModal from 'components/organism/result-modal';
import { createContext, useContext, useState } from 'react';

type ModalArgs = {
  result?: any;
  amount?: number | string;
  pool: Pool;
  onClose?: () => void;
};

export const ModalContext = createContext({
  errorPopup: () => {},
  drawOpen: (args: ModalArgs) => {},
  loseOpen: (args: ModalArgs) => {},
  successOpen: (args: ModalArgs) => {},
  depositOpen: (args: ModalArgs) => {},
  withdrawOpen: (args: ModalArgs) => {},
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const errorDisclosure = useDisclosure();
  const drawDisclosure = useDisclosure();
  const loseDisclosure = useDisclosure();
  const successDisclosure = useDisclosure();
  const depositDisclosure = useDisclosure();
  const withdrawDisclosure = useDisclosure();
  const [onSuccessClose, setOnSuccessClose] = useState<() => void>();
  const [onDepositClose, setOnDepositClose] = useState<() => void>();
  const [onWithdrawClose, setOnWithdrawClose] = useState<() => void>();
  const [withdrawResult, setWithdrawResult] = useState();
  const [successResult, setSuccessResult] = useState();
  const [depositResult, setDepositResult] = useState();
  const [amount, setAmount] = useState<number | string>(0);
  const [drawResult, setDrawResult] = useState();
  const [pool, setPool] = useState<Pool>();
  return (
    <ModalContext.Provider
      value={{
        errorPopup: errorDisclosure.onOpen,
        drawOpen: ({ result, pool }: ModalArgs) => {
          drawDisclosure.onOpen();
          setDrawResult(result);
          setPool(pool);
        },
        loseOpen: ({ pool }: ModalArgs) => {
          loseDisclosure.onOpen();
          setPool(pool);
        },
        successOpen: ({ result, pool, amount, onClose }) => {
          successDisclosure.onOpen();
          setSuccessResult(result);
          setPool(pool);
          setAmount(amount);
          setOnSuccessClose(onClose);
        },
        depositOpen: ({ result, pool, amount, onClose }) => {
          depositDisclosure.onOpen();
          setDepositResult(result);
          setPool(pool);
          setAmount(amount);
          setOnDepositClose(onClose);
        },
        withdrawOpen: ({ result, pool, amount, onClose }) => {
          withdrawDisclosure.onOpen();
          setWithdrawResult(result);
          setPool(pool);
          setAmount(amount);
          setOnWithdrawClose(onClose);
        },
      }}
    >
      {children}
      <ResultModal
        type="REWARD"
        result={drawResult}
        pool={pool}
        {...drawDisclosure}
      />
      <ResultModal type="UNSELECTED" pool={pool} {...loseDisclosure} />
      <ResultModal
        type="SUCCESS"
        result={successResult}
        pool={pool}
        amount={amount}
        {...successDisclosure}
        onClose={() => {
          successDisclosure.onClose();
          onSuccessClose?.();
        }}
      />
      <ResultModal
        type="DEPOSIT"
        result={depositResult}
        pool={pool}
        amount={amount}
        {...depositDisclosure}
        onClose={() => {
          depositDisclosure.onClose();
          onDepositClose?.();
        }}
      />
      <ResultModal
        type="WITHDRAW"
        result={withdrawResult}
        pool={pool}
        amount={amount}
        {...withdrawDisclosure}
        onClose={() => {
          withdrawDisclosure.onClose();
          onWithdrawClose?.();
        }}
      />
      <ResultModal
        type="ERROR"
        {...errorDisclosure}
        onClose={() => {
          errorDisclosure.onClose();
        }}
      />
    </ModalContext.Provider>
  );
};
