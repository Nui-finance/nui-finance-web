import {
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  NumberInput,
  NumberInputField,
  Skeleton,
  Text,
  UseDisclosureProps,
} from '@chakra-ui/react';
import { poolCoin } from 'applications/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { formatAddress, roundTo, useIntl } from 'utils';
import { number, object } from 'yup';
import { useWithdraw } from 'applications/mutation';
import { Pool } from 'applications/type';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalFooter,
} from 'components/molecule/responsive-modal';
import { Wallet } from 'components/molecule/icons';
import useGetUserStakeInfo from 'applications/query/use-get-user-stake-info';
import { useModal } from '../modals';
type WithdrawModalProps = {
  pool: Pool;
  isOpen: boolean;
  onClose: () => void;
} & UseDisclosureProps;

type WithdrawSchema = {
  amount: number;
};

let withdrawing = false;

const WithdrawModal = ({ pool, isOpen, onClose }: WithdrawModalProps) => {
  const { poolType } = pool ?? {};
  const { formatBalance } = useIntl();
  const account = useCurrentAccount();
  const { data: userStakeInfo, isPending: isStakeInfoLoading } =
    useGetUserStakeInfo({
      pool,
    });
  const userStakeAmount = userStakeInfo?.userStakeTotalAmount;
  const { withdrawOpen } = useModal();

  const schema = object({
    amount: number()
      .positive()
      .required()
      .test(function (amount) {
        // if (pool?.poolType === PoolTypeEnum.VALIDATOR && amount < 1) {
        //   return this.createError({
        //     message: 'amount must be greater than or equal to 1',
        //   });
        // }
        if (amount <= userStakeAmount) {
          return true;
        } else {
          return this.createError({ message: 'Insufficient balance' });
        }
      }),
  }).required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      amount: 0,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const amount = watch('amount');
  const onModalClose = () => {
    setValue('amount', 0);
    onClose();
  };

  const { mutate: withdraw, isPending } = useWithdraw({
    poolType: pool?.poolType,
    onSuccess: (data: any) => {
      withdrawOpen({
        pool,
        result: data,
        amount: data.withdrawAmount,
        onClose: () => {
          onModalClose();
        },
      });
    },
    onError: () => {
      onModalClose();
    },
    onSettled: () => {
      withdrawing = false;
    },
  });

  const onSubmit = (data: WithdrawSchema) => {
    if (withdrawing) return;
    withdrawing = true;
    withdraw({
      withdrawAmount: data.amount,
    });
  };
  const withdrawPercentageOptions = [25, 50, 75, 100];
  return (
    <ResponsiveModal size="sm" isOpen={isOpen} onClose={onModalClose}>
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
                  Enter Withdraw Amount
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
                    <Text>usd</Text>
                    <Flex>
                      <Text>Balance: </Text>
                      <Skeleton isLoaded={!isStakeInfoLoading}>
                        <Text>
                          {isNaN(userStakeAmount)
                            ? '--'
                            : formatBalance(userStakeAmount)}{' '}
                          {poolCoin[poolType]?.name}
                        </Text>
                      </Skeleton>
                    </Flex>
                  </Flex>
                  <Flex gap="2" alignSelf="self-end">
                    {withdrawPercentageOptions.map((option) => {
                      return (
                        <Button
                          key={option}
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setValue(
                              'amount',
                              roundTo(
                                (Number(userStakeAmount) * option) / 100,
                                3,
                              ),
                            );
                            trigger('amount');
                          }}
                        >
                          {option === 100 ? 'Max' : option + '%'}
                        </Button>
                      );
                    })}
                  </Flex>
                </Flex>
              </Flex>
            </FormControl>

            <Flex w="full" justifyContent="space-between">
              <Text>Destination Wallet</Text>
              <Flex alignItems="center" gap="2">
                <Wallet color="primary.500" boxSize={6} />
                <Text color="primary.500" fontSize="sm" fontWeight="medium">
                  {formatAddress(account?.address)}
                </Text>
              </Flex>
            </Flex>
            <Divider bgColor="neutral.400" />
            {/* {pool?.poolType === PoolTypeEnum.VALIDATOR && (
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton bg="transparent">
                    <Box flex="1" color="neutral.900" textAlign="left">
                      Pending
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>No Pending</AccordionPanel>
                </AccordionItem>
              </Accordion>
            )} */}
          </Flex>
        </ResponsiveModalBody>
        <ResponsiveModalFooter px="8" pt="6" pb="8">
          <Flex w="full" flexDirection="column" gap="2">
            <Button
              variant="solid"
              colorScheme="primary"
              isDisabled={!isValid || !account?.address}
              type="submit"
              isLoading={isPending}
            >
              {`Withdraw ${amount} ${poolCoin[poolType]?.name}`}
            </Button>
          </Flex>
        </ResponsiveModalFooter>
      </form>
    </ResponsiveModal>
  );
};

export default WithdrawModal;
