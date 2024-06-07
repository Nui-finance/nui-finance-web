import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  NumberInput,
  NumberInputField,
  Skeleton,
  Text,
  UseDisclosureProps,
  useMediaQuery,
} from '@chakra-ui/react';
import { poolCoin, poolSwapUrl } from 'applications/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useController, useForm, useWatch } from 'react-hook-form';
import { useIntl } from 'utils';
import { boolean, number, object, string } from 'yup';
import { useStake } from 'applications/mutation';
import { Pool } from 'applications/type';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalFooter,
} from 'components/molecule/responsive-modal';
import { Image, Link, TokenPairIcon } from 'components/molecule';
import { ArrowDown, ArrowUp, Buck, Sui } from 'components/molecule/icons';
import useGetUsdRate from 'applications/query/use-get-usd-rate';
import { useModal } from '../modals';
import { BucketCoinTypeEnum, PoolTypeEnum } from 'sui-api-final-v2';
import {
  MenuSelect,
  MenuSelectOptionType,
} from 'components/molecule/menu-select';
import useGetBalance from 'applications/query/use-get-balance';
import { useEffect, useState } from 'react';
import Convert from 'components/molecule/icons/convert.png';
import Usdt from 'components/molecule/icons/usdt';
import Usdc from 'components/molecule/icons/usdc';
type DepositModalProps = {
  pool: Pool;
  isOpen: boolean;
  onClose: () => void;
} & UseDisclosureProps;

type DepositSchema = {
  amount: number;
  consent: boolean;
  stakeAmount: number;
  coinType: MenuSelectOptionType;
};

let staking = false;

const DepositModal = ({ pool, isOpen, onClose }: DepositModalProps) => {
  const { poolType } = pool ?? {};
  const [isDesktop] = useMediaQuery('(min-width: 768px)');
  const { formatBalance, formatUSD } = useIntl();
  const account = useCurrentAccount();
  const [schemaBalance, setSchemaBalance] = useState<number>(0);

  const { depositOpen } = useModal();

  const buckcoinOptions = [
    {
      label: 'BUCK',
      value: BucketCoinTypeEnum.BUCK,
    },
    {
      label: 'USDT',
      value: BucketCoinTypeEnum.USDT,
    },
    {
      label: 'USDC',
      value: BucketCoinTypeEnum.USDC,
    },
  ];

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
        if (amount <= schemaBalance) {
          return true;
        } else {
          return this.createError({ message: 'Insufficient balance' });
        }
      }),
    consent: boolean()
      .required()
      .test(function (consent) {
        if (consent === true) {
          return true;
        } else {
          return this.createError({ message: 'Please agree the term' });
        }
      }),
    stakeAmount: number().positive().min(0.01).required(),
    coinType: object({
      label: string(),
      value: string(),
    }),
  }).required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
    control,
    trigger,
  } = useForm({
    defaultValues: {
      amount: 0,
      consent: false,
      stakeAmount: 0,
      ...(pool?.poolType === PoolTypeEnum.BUCKET_PROTOCOL
        ? {
            coinType: buckcoinOptions[0],
          }
        : {}),
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const amount = watch('amount');
  const onModalClose = () => {
    setValue('amount', 0);
    setValue('stakeAmount', 0);
    setValue('consent', false);
    setValue('coinType', buckcoinOptions[0]);
    onClose();
  };

  const coinTypeController = useController({
    name: 'coinType',
    control,
    defaultValue: buckcoinOptions[0],
  });
  const coinName =
    pool?.poolType === PoolTypeEnum.BUCKET_PROTOCOL
      ? coinTypeController.field.value?.label
      : poolCoin[pool?.poolType]?.name;
  const { data: rateInfo, isPending: isGettingUsdRate } = useGetUsdRate({
    coinName,
  });

  const {
    data: balanceObject,
    isPending: isGettingBalance,
    isSuccess: isGetBalanceSuccess,
  } = useGetBalance({
    coinName:
      pool?.poolType === PoolTypeEnum.BUCKET_PROTOCOL
        ? coinTypeController.field.value?.label
        : poolCoin[poolType]?.name,
  });

  useEffect(() => {
    if (isGetBalanceSuccess) {
      setSchemaBalance(balanceObject?.formatted);
    }
  }, [balanceObject?.formatted, isGetBalanceSuccess]);

  const balance = balanceObject?.formatted;
  const hasLittleAmount = balanceObject?.hasLittleAmount;

  const { mutate: stake, isPending } = useStake({
    onSuccess: (data: any) => {
      depositOpen({
        pool,
        result: data,
        amount: stakeAmount,
        onClose: () => {
          onModalClose();
        },
      });
    },
    onError: () => {
      onModalClose();
    },
    onSettled: () => {
      staking = false;
    },
  });

  const onSubmit = (data: DepositSchema) => {
    if (!staking) {
      staking = true;
      stake({
        stakeAmount: data.amount,
        poolId: pool.poolId,
        bucketStakeCoinType: data?.coinType?.value as BucketCoinTypeEnum,
      });
    }
  };
  const needTransition =
    coinTypeController.field.value?.label === 'USDT' ||
    coinTypeController.field.value?.label === 'USDC';
  const stakeAmount = useWatch({
    control,
    name: 'stakeAmount',
  });

  const setStakeAmount = (value: number) => {
    const stakeAmount = needTransition ? value * 0.995 : value;
    setValue('stakeAmount', stakeAmount);
    trigger('stakeAmount');
  };
  return (
    <ResponsiveModal
      size="sm"
      isOpen={isOpen}
      onClose={() => {
        onModalClose();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ResponsiveModalBody px="8" pt="8" pb="0">
          <Flex flexDirection="column" gap="6">
            <FormControl
              isInvalid={!!errors?.amount}
              h="full"
              position="relative"
            >
              <Flex flexDirection="column" gap="2">
                <Text fontWeight="medium" fontSize="lg" color="text.secondary">
                  Enter Deposit Amount
                </Text>
                <Flex alignItems="center">
                  <NumberInput h="full" value={amount}>
                    <NumberInputField
                      px="1"
                      fontSize={{ base: '32px', md: '40px' }}
                      fontWeight="bold"
                      color="text.primary"
                      {...register('amount')}
                      onChange={(e) => {
                        register('amount').onChange(e);
                        const amount = isNaN(Number(e.target.value))
                          ? 0
                          : Number(e.target.value);
                        setStakeAmount(amount);
                      }}
                    />
                  </NumberInput>
                  {pool?.poolType === PoolTypeEnum.BUCKET_PROTOCOL ? (
                    <MenuSelect
                      menuDrawerEnabled
                      options={buckcoinOptions}
                      value={
                        coinTypeController.field.value as MenuSelectOptionType
                      }
                      onChange={(value) => {
                        coinTypeController.field.onChange(value);
                        setValue('amount', 0);
                        setValue('stakeAmount', 0);
                      }}
                      menuButtonProps={{
                        variant: 'ghost',
                        px: '3',
                        borderRadius: '2xl',
                      }}
                      renderButtonText={(option) => (
                        <Heading as="h2">{option.label}</Heading>
                      )}
                      renderButtonIcon={(isOpen) => {
                        return isOpen ? <ArrowUp /> : <ArrowDown />;
                      }}
                      menuListProps={{
                        borderRadius: '32px',
                        p: '2',
                      }}
                      menuItemOptionProps={{
                        borderRadius: '16px',
                      }}
                      renderOption={(option) => {
                        const IconsMap = {
                          BUCK: PoolTypeEnum.BUCKET_PROTOCOL,
                          USDT: 'USDT',
                          USDC: 'USDC',
                        };
                        return (
                          <Flex p="4" gap="3" alignItems="center">
                            <TokenPairIcon
                              size="xs"
                              tokenIn={IconsMap[option.label]}
                              tokenOut={PoolTypeEnum.SCALLOP_PROTOCOL_SUI}
                              hasWhiteBorder={false}
                            />
                            <Text
                              fontSize={{ base: 'md', md: 'xl' }}
                              fontWeight="semibold"
                            >
                              {option.label}
                            </Text>
                          </Flex>
                        );
                      }}
                      menuItemOptionIconProps={{
                        boxSize: '8',
                      }}
                    />
                  ) : (
                    <Heading as="h2" fontSize="40px">
                      {poolCoin[poolType]?.name}
                    </Heading>
                  )}
                </Flex>
                <Flex gap="2" w="full" flexDirection="column">
                  <Flex justifyContent="space-between">
                    <Skeleton isLoaded={!isGettingUsdRate} maxW="50%">
                      <Text textOverflow="ellipsis">
                        {formatUSD(amount * Number(rateInfo?.stakeCoinUsdRate))}
                      </Text>
                    </Skeleton>
                    <Flex gap="1">
                      <Text>Balance:</Text>
                      <Skeleton isLoaded={!isGettingBalance}>
                        <Text>
                          {hasLittleAmount ? '< 0.01' : formatBalance(balance)}{' '}
                          {pool?.poolType === PoolTypeEnum.BUCKET_PROTOCOL
                            ? coinTypeController?.field?.value?.label
                            : poolCoin[poolType]?.name}
                        </Text>
                      </Skeleton>
                    </Flex>
                  </Flex>
                  <Button
                    size="xs"
                    alignSelf="self-end"
                    variant="outline"
                    onClick={() => {
                      setValue('amount', balance);
                      setStakeAmount(balance);
                    }}
                  >
                    Max
                  </Button>
                </Flex>
              </Flex>
              {amount < 0.01 && !needTransition && (
                <FormErrorMessage>
                  {poolCoin[poolType]?.name} must be greater than or equal to
                  0.01
                </FormErrorMessage>
              )}
            </FormControl>

            {needTransition && (
              <Flex w="full" justifyContent="center">
                <Box w="8" h="8">
                  <Image src={Convert} alt="Convert" />
                </Box>
              </Flex>
            )}

            {needTransition && (
              <Flex flexDirection="column" gap="2">
                <Text fontWeight="medium" color="text.secondary" fontSize="lg">
                  =Deposit in
                </Text>
                <FormControl
                  isInvalid={!!errors?.stakeAmount}
                  h="full"
                  position="relative"
                >
                  <Flex alignItems="center">
                    <NumberInput h="full" value={stakeAmount}>
                      <NumberInputField
                        // readOnly
                        fontSize={{ base: '32px', md: '40px' }}
                        fontWeight="bold"
                        color="text.primary"
                        {...register('stakeAmount')}
                        onChange={(e) => {
                          register('stakeAmount').onChange(e);
                          const stakeAmount = isNaN(Number(e.target.value))
                            ? 0
                            : Number(e.target.value);
                          const amount = (stakeAmount / 0.995).toFixed(5);
                          setValue('amount', Number(amount));
                          trigger('amount');
                        }}
                      />
                    </NumberInput>
                    <Heading as="h2">{poolCoin[poolType]?.name}</Heading>
                  </Flex>
                  {errors?.stakeAmount && (
                    <FormErrorMessage>
                      BUCK must be greater than or equal to 0.01
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
            )}

            {pool?.poolType !== 'SCALLOP_PROTOCOL_SUI' &&
              !!poolType &&
              !needTransition && (
                <Text color="text.secondary">
                  <Link
                    href={poolSwapUrl[poolType]}
                    target="_blank"
                    textDecoration="underline"
                    color="text.secondary"
                    mr="1"
                  >
                    Swap
                  </Link>
                  if you don’t have the right currency.
                </Text>
              )}
            {needTransition && (
              <Text color="text.secondary">
                <Link
                  href={'https://portalbridge.com/'}
                  target="_blank"
                  textDecoration="underline"
                  color="text.secondary"
                  mr="1"
                >
                  Bridge
                </Link>
                your USDC/USDT if it is on other chains.
              </Text>
            )}
            <FormControl isInvalid={!!errors?.consent}>
              <Checkbox {...register('consent')}>
                <Text color="text.secondary">I understand the risk</Text>
              </Checkbox>
              {errors?.consent && (
                <FormErrorMessage mt="0" mb="2">
                  {errors?.consent?.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </ResponsiveModalBody>
        <ResponsiveModalFooter px="8" pt="1" pb="8">
          <Flex w="full" justifyContent="center">
            <Button
              variant="solid"
              flex="1"
              colorScheme="primary"
              isDisabled={!isValid || !account?.address}
              type="submit"
              isLoading={isPending}
            >
              {errors?.amount?.message === 'Insufficient balance'
                ? 'Insufficient balance'
                : 'Deposit'}
            </Button>
          </Flex>
        </ResponsiveModalFooter>
      </form>
    </ResponsiveModal>
  );
};

export default DepositModal;
