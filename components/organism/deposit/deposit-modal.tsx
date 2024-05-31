import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  NumberInput,
  NumberInputField,
  Text,
  UseDisclosureProps,
  useDisclosure,
} from '@chakra-ui/react';
import { poolCoin, poolSwapUrl } from 'applications/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { roundNumber, useIntl } from 'utils';
import { boolean, number, object } from 'yup';
import { useStake } from 'applications/mutation';
import { Pool } from 'applications/type';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalFooter,
} from 'components/molecule/responsive-modal';
import ResultModal from '../result-modal';
import { useRef, useState } from 'react';
import useGetUserBalanceInfo from 'applications/query/use-get-user-balance-info';
import { Link } from 'components/molecule';
import useGetUsdRate from 'applications/query/use-get-usd-rate';
type DepositModalProps = {
  pool: Pool;
  isOpen: boolean;
  onClose: () => void;
} & UseDisclosureProps;

type DepositSchema = {
  amount: number;
  consent: boolean;
};

let staking = false;

const DepositModal = ({ pool, isOpen, onClose }: DepositModalProps) => {
  const { poolType } = pool ?? {};

  const { formatBalance, formatUSD } = useIntl();
  const account = useCurrentAccount();
  const { data: rateInfo } = useGetUsdRate({
    poolType,
  });

  const { data: useBalanceMap } = useGetUserBalanceInfo({
    pool,
  });
  const balance = roundNumber(
    useBalanceMap?.get(pool?.poolType)?.totalBalance,
    2,
  );
  const [result, setResult] = useState();

  const successDisclosure = useDisclosure();

  const { mutate: stake, isPending } = useStake({
    onSuccess: (data: any) => {
      setResult(data);
      successDisclosure.onOpen();
    },
    onError: () => {
      onClose();
    },
    onSettled: () => {
      staking = false;
    },
  });

  const schema = object({
    amount: number()
      .positive()
      .min(0.01)
      .required()
      .test(function (amount) {
        // if (pool?.poolType === PoolTypeEnum.SCALLOP_PROTOCOL_SUI && amount < 1) {
        //   return this.createError({
        //     message: 'amount must be greater than or equal to 1',
        //   });
        // }
        if (amount <= balance) {
          return true;
        } else {
          return this.createError({ message: 'Insufficient balance' });
        }
      }),
    consent: boolean().test(function (consent) {
      if (consent === true) {
        return true;
      } else {
        return this.createError({ message: 'Please agree the term' });
      }
    }),
  }).required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      amount: 0,
      consent: false,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const amount = watch('amount');
  const onSubmit = (data: DepositSchema) => {
    if (!staking) {
      staking = true;
      stake({
        stakeAmount: data.amount,
        poolId: pool.poolId,
      });
    }
  };
  return (
    <ResponsiveModal size="sm" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ResponsiveModalBody px="8" pt="8" pb="0">
          <Flex flexDirection="column" gap="6">
            <FormControl
              isInvalid={!!errors?.amount}
              h="full"
              position="relative"
            >
              <Flex flexDirection="column" gap="2">
                <Text fontWeight="medium" fontSize="lg">
                  Enter Deposit Amount
                </Text>
                <Flex alignItems="center">
                  <NumberInput h="full" value={amount}>
                    <NumberInputField
                      fontSize="40px"
                      fontWeight="bold"
                      color="text.primary"
                      {...register('amount')}
                    />
                  </NumberInput>
                  <Heading as="h2" fontSize="40px">
                    {poolCoin[poolType]?.name}
                  </Heading>
                </Flex>
                {/* {errors?.amount && (
                  <FormErrorMessage position="absolute" bottom="0">
                    {errors?.amount?.message}
                  </FormErrorMessage>
                )} */}
                <Flex gap="2" w="full" flexDirection="column">
                  <Flex justifyContent="space-between">
                    <Text>
                      {formatUSD(amount * Number(rateInfo?.stakeCoinUsdRate))}
                    </Text>
                    <Flex>
                      <Text>Balance:</Text>
                      <Text>
                        {formatBalance(balance)} {poolCoin[poolType]?.name}
                      </Text>
                    </Flex>
                  </Flex>
                  <Button
                    size="xs"
                    alignSelf="self-end"
                    variant="outline"
                    onClick={() => {
                      setValue('amount', balance);
                    }}
                  >
                    Max
                  </Button>
                </Flex>
              </Flex>
            </FormControl>

            {pool?.poolType !== 'SCALLOP_PROTOCOL_SUI' && (
              <Flex gap="1">
                <Link
                  href={poolSwapUrl[poolType]}
                  target="_blank"
                  textDecoration="underline"
                >
                  Swap
                </Link>
                <Text>if you don’t have the right currency.</Text>
              </Flex>
            )}
            <FormControl isInvalid={!!errors?.consent}>
              <Checkbox {...register('consent')}>
                <Text color="neutral.900">I understand the risk</Text>
              </Checkbox>
              {errors?.consent && (
                <FormErrorMessage mt="0" mb="2">
                  {errors?.consent?.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </ResponsiveModalBody>
        <ResponsiveModalFooter px="8" pt="0" pb="8">
          <Flex w="full" justifyContent="center">
            <Button
              variant="solid"
              flex="1"
              colorScheme="primary"
              isDisabled={!isValid || !account?.address}
              type="submit"
              isLoading={isPending}
            >
              Deposit
            </Button>
          </Flex>
        </ResponsiveModalFooter>
      </form>
      <ResultModal
        type="DEPOSIT"
        result={result}
        pool={pool}
        amount={amount}
        {...successDisclosure}
        onClose={() => {
          successDisclosure.onClose();
          onClose();
        }}
      />
    </ResponsiveModal>
  );
};

export default DepositModal;
