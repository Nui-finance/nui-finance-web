import {
  Container,
  Flex,
  Heading,
  Text,
  HStack,
  Tooltip,
  VStack,
  Tag,
  chakra,
  Input,
  useCheckboxGroup,
  useCheckbox,
  Skeleton,
} from '@chakra-ui/react';

import useGetPoolList from 'applications/query/use-get-pool-list';
import { LinkButton, TokenPairIcon } from 'components/molecule';
import { ArrowRight, Info } from 'components/molecule/icons';
import { PoolTypeEnum } from 'sui-api-final-v2';
import { roundNumber, useIntl } from 'utils';
import useCountdown from 'utils/use-countdown';
import RecentWinner from './raffles/recent-winner';
import useGetWinnerHistory from 'applications/query/use-get-winner-history';
import { poolCoin, poolPageName } from 'applications/constants';
import { Pool } from 'applications/type';
import SupportU from 'components/molecule/icons/support-u';

type LocalPool = {
  stakeCoinName: string;
  rewardCoinName: string;
  reward: number;
  totalDeposit: number;
  totalAttendance: number;
  endTime: number;
  link: string;
  tokenIn: string;
  tokenOut: string;
  supportU?: boolean;
} & Pool;

const FilterTag = ({ tag, ...groupProps }) => {
  const { getCheckboxProps, getInputProps } = useCheckbox(groupProps);
  const { isChecked } = groupProps;
  return (
    <chakra.label cursor="pointer">
      <Input {...getInputProps()} hidden />
      <Tag
        border="1px solid"
        borderColor="neutral.100"
        borderRadius="2rem"
        color="text.primary"
        bg={isChecked ? 'neutral.200' : 'transparent'}
        _hover={{
          bg: isChecked ? 'neutral.200' : 'neutral.100',
        }}
        _active={{
          bg: 'neutral.200',
        }}
        {...getCheckboxProps()}
      >
        {tag}
      </Tag>
    </chakra.label>
  );
};

const PoolBlock = ({
  pool,
  isLoading,
  supportU,
}: {
  pool: LocalPool;
  isLoading: boolean;
  supportU?: boolean;
}) => {
  const countdown = useCountdown(Number(pool?.endTime));
  const { formatPrice } = useIntl();
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      gap="8"
      p="8"
      w="full"
      bgColor="background.primary"
      borderRadius="32px"
      position="relative"
    >
      {supportU && (
        <SupportU boxSize="24" position="absolute" top="0" right="0" />
      )}
      <TokenPairIcon
        size="lg"
        tokenIn={pool?.tokenIn}
        tokenOut={pool?.tokenOut}
      />
      <Flex flexDirection="column" gap="2" align="center" w="110%">
        <Text color="text.secondary" fontSize="sm" textAlign="center">
          A weekly chance to win
        </Text>
        <Skeleton
          isLoaded={!isLoading}
          w="full"
          display="flex"
          justifyContent="center"
        >
          <Tooltip
            label={`${pool.reward} ${pool.rewardCoinName}`}
            isDisabled={pool.reward > 0.001}
            shouldWrapChildren
          >
            <Heading as="h2" fontSize="40px" textAlign="center">
              {isNaN(pool.reward) ? '--' : formatPrice(pool.reward)}{' '}
              {pool.rewardCoinName}
            </Heading>
          </Tooltip>
        </Skeleton>
        <Skeleton
          isLoaded={!isLoading}
          minW="20"
          display="flex"
          justifyContent="center"
        >
          <Text color="primary.400" fontSize="sm">
            {countdown}
          </Text>
        </Skeleton>
      </Flex>
      <Flex flexDirection="column" w="full">
        <Flex justifyContent="space-between" alignItems="center" gap="2">
          <Text color="text.secondary" fontSize="sm">
            Total Deposit
          </Text>
          <Skeleton
            isLoaded={!isLoading}
            minW="14"
            display="flex"
            justifyContent="flex-end"
          >
            <Text color="text.primary" fontSize="sm" textAlign="right">
              {isNaN(pool.totalDeposit) ? '--' : formatPrice(pool.totalDeposit)}{' '}
              {pool.stakeCoinName}
            </Text>
          </Skeleton>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" gap="2">
          <Text color="text.secondary" fontSize="sm">
            Total Attendance
          </Text>
          <Skeleton
            isLoaded={!isLoading}
            minW="14"
            display="flex"
            justifyContent="flex-end"
          >
            <Text color="text.primary" fontSize="sm">
              {isNaN(pool.totalAttendance)
                ? '--'
                : formatPrice(pool.totalAttendance)}
            </Text>
          </Skeleton>
        </Flex>
      </Flex>
      <LinkButton
        href={pool.link}
        variant="solid"
        colorScheme="primary"
        fontSize="sm"
        fontWeight="medium"
        rightIcon={<ArrowRight boxSize="8" />}
        alignSelf="stretch"
        mt="auto"
        whiteSpace="normal"
      >
        Earn Now
      </LinkButton>
    </Flex>
  );
};

const Main = () => {
  const { data: poolList, isLoading } = useGetPoolList();

  const scallopSuiPool = poolList?.find(
    (pool) => pool.poolType === PoolTypeEnum.SCALLOP_PROTOCOL_SUI,
  );
  const bucketPool = poolList?.find(
    (pool) => pool.poolType === PoolTypeEnum.BUCKET_PROTOCOL,
  );
  const scallopPool = poolList?.find(
    (pool) => pool.poolType === PoolTypeEnum.SCALLOP_PROTOCOL,
  );

  const defaultCheckBoxes = [
    PoolTypeEnum.SCALLOP_PROTOCOL_SUI,
    PoolTypeEnum.BUCKET_PROTOCOL,
    PoolTypeEnum.SCALLOP_PROTOCOL,
  ];
  const { value: checkboxValue, getCheckboxProps } = useCheckboxGroup({
    defaultValue: defaultCheckBoxes,
  });

  const { data: winnerHistory, isLoading: isWinnerHistoryLoading } =
    useGetWinnerHistory();
  const winners = winnerHistory?.filter((winner) =>
    checkboxValue.includes(winner.poolType),
  );

  const pools: LocalPool[] = [
    {
      ...scallopSuiPool,
      stakeCoinName: scallopSuiPool?.stakeCoinName,
      rewardCoinName: scallopSuiPool?.rewardCoinName,
      reward: scallopSuiPool?.rewardAmount,
      totalDeposit: roundNumber(scallopSuiPool?.statistics?.totalDeposit, 3),
      totalAttendance: scallopSuiPool?.statistics?.totalAttendance,
      endTime:
        Number(scallopSuiPool?.timeInfo?.rewardDuration) * 1000 +
        Number(scallopSuiPool?.timeInfo?.startTime),
      link: `/raffles/${poolPageName[PoolTypeEnum.SCALLOP_PROTOCOL_SUI]}`,
      tokenIn: 'SCALLOP_PROTOCOL_SUI',
      tokenOut: 'SCALLOP_PROTOCOL_SUI',
    },
    {
      ...bucketPool,
      stakeCoinName: bucketPool?.stakeCoinName,
      rewardCoinName: bucketPool?.rewardCoinName,
      reward: bucketPool?.rewardAmount,
      totalDeposit: roundNumber(bucketPool?.statistics?.totalDeposit, 3),
      totalAttendance: bucketPool?.statistics?.totalAttendance,
      endTime:
        Number(bucketPool?.timeInfo?.rewardDuration) * 1000 +
        Number(bucketPool?.timeInfo?.startTime),
      link: `/raffles/${poolPageName[PoolTypeEnum.BUCKET_PROTOCOL]}`,
      tokenIn: 'BUCKET_PROTOCOL',
      tokenOut: 'SCALLOP_PROTOCOL_SUI',
      supportU: true,
    },
    {
      ...scallopPool,
      stakeCoinName: scallopPool?.stakeCoinName,
      rewardCoinName: scallopPool?.rewardCoinName,
      reward: scallopPool?.rewardAmount,
      totalDeposit: roundNumber(scallopPool?.statistics?.totalDeposit, 3),
      totalAttendance: scallopPool?.statistics?.totalAttendance,
      endTime:
        Number(scallopPool?.timeInfo?.rewardDuration) * 1000 +
        Number(scallopPool?.timeInfo?.startTime),
      link: `/raffles/${poolPageName[PoolTypeEnum.SCALLOP_PROTOCOL]}`,
      tokenIn: 'SCALLOP_PROTOCOL',
      tokenOut: 'SCALLOP_PROTOCOL',
    },
  ];
  return (
    <Container
      maxW="container.page"
      px="0"
      pt="16"
      as={Flex}
      flexDirection="column"
      gap="12"
      alignItems="center"
    >
      <Flex flexDirection="column" gap="4" alignItems="center">
        <Heading
          as="h1"
          color="primary.400"
          textAlign="center"
          fontSize={{ base: '2.5rem', md: '3rem' }}
          lineHeight="56px"
        >
          No Loss, Win Big Rewards.
        </Heading>
        <Text
          color="neutral.600"
          fontSize={{
            base: 'md',
            md: 'xl',
          }}
          textAlign="center"
          fontWeight="medium"
        >
          Deposit Anytime, Withdraw Anytime.
        </Text>
      </Flex>
      <Flex
        w="full"
        gap={{ base: '4', md: '6' }}
        justifyContent="center"
        direction={{ base: 'column', md: 'row' }}
      >
        {pools?.map((pool, index) => {
          return (
            <PoolBlock
              key={index}
              pool={pool}
              isLoading={isLoading}
              supportU={pool?.supportU}
            />
          );
        })}
      </Flex>
      <VStack
        gap="4"
        p="8"
        bgColor="background.primary"
        borderRadius="2rem"
        alignSelf="stretch"
      >
        <Heading as="h3" alignSelf="stretch">
          Recent Winner
        </Heading>
        <HStack alignSelf="stretch">
          {defaultCheckBoxes?.map((value) => {
            return (
              <FilterTag
                key={value}
                tag={poolCoin[value]?.name}
                {...getCheckboxProps({
                  value,
                })}
              />
            );
          })}
        </HStack>
        <RecentWinner
          items={winners}
          isLoading={isWinnerHistoryLoading || isLoading}
        />
      </VStack>
      <HStack gap="1" alignItems="center">
        <Text fontSize="xs" color="text.secondary">
          Investing Disclosures
        </Text>
        <Tooltip
          label="Investing involves risks, including loss of capital; consider your objectives and consult a financial advisor."
          shouldWrapChildren
        >
          <Info boxSize="1rem" h="28px" color="text.secondary" />
        </Tooltip>
      </HStack>
    </Container>
  );
};

export default Main;
