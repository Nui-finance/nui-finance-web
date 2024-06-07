import {
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Skeleton,
  Tag,
  Text,
  VStack,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { poolCoin } from 'applications/constants';
import { PoolTypeEnum } from 'sui-api-final-v2';
import { Image, Link, TokenPairIcon } from 'components/molecule';
import { ArrowLeft, Buck } from 'components/molecule/icons';
import {
  convertScientificToDecimal,
  getProtocolLabel,
  roundNumber,
  useIntl,
} from 'utils';
import DepositModal from 'components/organism/deposit/deposit-modal';
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import useCountdown from 'utils/use-countdown';
import WithdrawModal from 'components/organism/withdraw/withdraw-modal';
import { useClaim } from 'applications/mutation';
import useGetPoolList from 'applications/query/use-get-pool-list';
import { Pool } from 'applications/type';
import { useState } from 'react';
import useGetUserStakeInfo from 'applications/query/use-get-user-stake-info';
import useGetUserWinnerInfo, {
  UserWinnerInfo,
} from 'applications/query/use-get-user-winner-info';
import { useModal } from 'components/organism/modals';
import Usdc from 'components/molecule/icons/usdc';
import RewardImage from 'assets/reward.png';

const ClaimBlock = ({
  pool,
  winnerInfoList,
}: {
  pool: Pool;
  winnerInfoList: UserWinnerInfo['winnerInfoList'];
}) => {
  const [claimed, setClaimed] = useState(false);
  const { successOpen } = useModal();
  const {
    mutate: claim,
    canClaim,
    isPending: isClaiming,
  } = useClaim({
    pool,
    winnerInfoList,
    onSuccess: (data: any) => {
      successOpen({
        pool,
        result: data,
        amount: convertScientificToDecimal(pool?.lastRewardBalance),
      });
      setClaimed(true);
    },
  });
  const { isPending } = useGetUserWinnerInfo({ pool });
  const countdown = useCountdown(
    Number(winnerInfoList?.[winnerInfoList?.length - 1]?.expireTime),
  );
  const round = Number(pool?.currentRound) - 1;
  return (
    <Skeleton isLoaded={!isPending} w="full">
      <VStack
        p="8"
        gap="4"
        bgColor="background.primary"
        borderRadius="2rem"
        alignSelf="stretch"
        display={claimed ? 'none' : 'flex'}
      >
        <HStack
          justifyContent="space-between"
          gap="4"
          wrap="wrap"
          alignSelf="stretch"
        >
          <HStack>
            <Tag
              fontSize="xs"
              bgColor="primary.400"
              color="neutral.50"
              borderRadius="2rem"
            >
              Claim Phase
            </Tag>
            <Text fontSize="sm">Week {round}</Text>
          </HStack>
          <Text color="primary.400" fontSize="sm">
            {countdown}
          </Text>
        </HStack>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap="4"
          alignItems="center"
          alignSelf="stretch"
        >
          <Box w="20" h="20">
            <Image src={RewardImage} alt="chosen image" fill />
          </Box>
          <Heading as="h3">You Got Chosen!</Heading>
          <Button
            isDisabled={!canClaim}
            flexGrow="1"
            flexShrink="0"
            alignSelf={{ base: 'stretch', md: 'center' }}
            onClick={() => {
              claim();
            }}
            isLoading={isClaiming}
          >
            Claim {convertScientificToDecimal(pool?.lastRewardBalance)}{' '}
            {pool?.rewardCoinName}
          </Button>
        </Flex>
      </VStack>
    </Skeleton>
  );
};

const PoolBlock = ({ poolType }: { poolType: PoolTypeEnum }) => {
  const depositDisclosure = useDisclosure();
  const withdrawDisclosure = useDisclosure();
  const [open, setOpen] = useState(false);
  const { formatBalance, formatUSD, formatPrice } = useIntl();
  const account = useCurrentAccount();

  const { data: poolList, isLoading: isLoadingPoolList } = useGetPoolList();
  const pool = poolList?.find((item) => item.poolType === poolType);
  const countdown = useCountdown(
    Number(pool?.timeInfo?.rewardDuration) * 1000 +
      Number(pool?.timeInfo?.startTime),
  );

  const { data: userStakeInfo, isPending: isStakeInfoLoading } =
    useGetUserStakeInfo({
      pool,
    });
  const { data: userWinnerInfo } = useGetUserWinnerInfo({ pool });
  const totalReward = pool?.rewardAmount;
  // const isInactive =
  //   pool?.poolType === PoolTypeEnum.VALIDATOR &&
  //   Number(pool?.timeInfo?.startTime + pool?.timeInfo?.lockStakeDuration) <
  //     Date.now();
  const winnerInfoList = userWinnerInfo?.winnerInfoList;

  return (
    <Container
      maxW="container.page"
      px={{ base: 4, md: 8 }}
      pt="8"
      as={Flex}
      flexDirection="column"
      gap="8"
      alignItems="center"
    >
      <WithdrawModal pool={pool} {...withdrawDisclosure} />
      <DepositModal pool={pool} {...depositDisclosure} />
      <Flex
        justifyContent="stretch"
        alignItems="center"
        gap="2"
        alignSelf="stretch"
        position="relative"
      >
        <IconButton
          as={Link}
          href="/"
          size="xl"
          w="14"
          icon={<ArrowLeft />}
          aria-label="Back to home page"
          position="absolute"
          top="0"
          left="0"
        />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
          gap={{ base: '6', md: '8' }}
          mx="auto"
        >
          <TokenPairIcon tokenIn={poolType} />
          <Heading as="h2">{getProtocolLabel(poolType)}</Heading>
        </Flex>
      </Flex>
      <VStack gap="4" alignSelf="stretch">
        {winnerInfoList?.length > 0 && (
          <ClaimBlock
            key={winnerInfoList[winnerInfoList?.length - 1]?.stakeShareId}
            pool={pool}
            winnerInfoList={[winnerInfoList?.[winnerInfoList?.length - 1]]}
          />
        )}
        <Flex gap="4" w="full" direction={{ base: 'column', md: 'row' }}>
          <Flex
            flex="1"
            borderRadius="32px"
            p="6"
            gap="6"
            flexDirection="column"
            bgColor="background.primary"
            alignSelf="stretch"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Flex gap="2" alignItems="center">
                <Tag borderRadius="full" bgColor="primary.100">
                  {/* {isInactive ? 'Locked' : 'Active'} */}
                  Active
                </Tag>
                <Skeleton isLoaded={!isLoadingPoolList}>
                  <Text fontSize="sm">#week {pool?.currentRound}</Text>
                </Skeleton>
              </Flex>
              <Skeleton isLoaded={!isLoadingPoolList}>
                <Text color="primary.400" fontSize="sm">
                  {countdown}
                </Text>
              </Skeleton>
            </Flex>
            <Flex flexDirection="column" gap="2">
              <Text color="text.secondary" fontSize="lg">
                EST. Prize
              </Text>
              <Skeleton isLoaded={!isLoadingPoolList}>
                <Flex gap="2" alignItems="center">
                  <Heading as="h2" fontSize="40px">
                    {!!account?.address ? formatBalance(totalReward) : '--'}
                  </Heading>
                  <Heading as="h2" fontSize="40px">
                    {pool?.rewardCoinName}
                  </Heading>
                </Flex>
              </Skeleton>
              <Skeleton isLoaded={!isLoadingPoolList}>
                <Text color="text.secondary" fontSize="sm">
                  {formatUSD(totalReward)}
                </Text>
              </Skeleton>
            </Flex>
            <Flex flexDirection="column" alignSelf="stretch" mt="auto">
              <Flex justifyContent="space-between" gap="2">
                <Text color="text.secondary" fontSize="sm">
                  Total Deposite
                </Text>
                <Skeleton isLoaded={!isLoadingPoolList} minW="14">
                  <Text fontSize="sm">
                    {!isNaN(pool?.statistics?.totalDeposit)
                      ? formatBalance(pool?.statistics?.totalDeposit)
                      : '--'}{' '}
                    {pool?.stakeCoinName}
                  </Text>
                </Skeleton>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" gap="2">
                <Text color="text.secondary" fontSize="sm">
                  Total Attendance
                </Text>
                <Skeleton
                  isLoaded={!isLoadingPoolList}
                  minW="14"
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Text color="text.primary" fontSize="sm">
                    {isNaN(pool?.statistics?.totalAttendance)
                      ? '--'
                      : formatPrice(Number(pool?.statistics?.totalAttendance))}
                  </Text>
                </Skeleton>
              </Flex>
              {/* <Flex justifyContent="space-between" gap="2">
                <Text color="text.secondary" fontSize="sm">
                  Yield Source
                </Text>
                <Text fontSize="sm">{poolSource[poolType]}</Text>
              </Flex> */}
            </Flex>
          </Flex>
          {!!account?.address && (
            <Flex
              flex="1"
              borderRadius="32px"
              p="6"
              gap="6"
              flexDirection="column"
              bgColor="background.primary"
            >
              <Flex flexDirection="column" gap="2">
                <Text color="text.secondary" fontSize="lg">
                  My Position
                </Text>

                <Skeleton isLoaded={!isStakeInfoLoading}>
                  <Flex gap="2">
                    <Heading as="h2">
                      {!!account?.address
                        ? formatBalance(userStakeInfo?.userStakeTotalAmount)
                        : '--'}
                    </Heading>
                    <Heading as="h2">{poolCoin[poolType]?.name}</Heading>
                  </Flex>
                </Skeleton>
                <Skeleton isLoaded={!isStakeInfoLoading}>
                  <Text color="text.secondary" fontSize="sm">
                    {!!account?.address
                      ? formatUSD(userStakeInfo?.userStakeTotalAmount)
                      : '--'}
                  </Text>
                </Skeleton>
              </Flex>
              <Flex justifyContent="space-between" gap="2">
                <Text color="text.secondary" fontSize="sm">
                  Win Chance
                </Text>
                <Skeleton isLoaded={!isStakeInfoLoading}>
                  <Text fontSize="sm">
                    EST.{' '}
                    {isNaN(userStakeInfo?.luckRate) ||
                    userStakeInfo?.luckRate === Infinity
                      ? '--'
                      : roundNumber(userStakeInfo?.luckRate, 2)}
                    %
                  </Text>
                </Skeleton>
              </Flex>
              <Flex gap="2" wrap="wrap">
                <Button
                  flex="1"
                  isDisabled={!account?.address || isStakeInfoLoading}
                  onClick={withdrawDisclosure.onOpen}
                >
                  Withdraw
                </Button>
                <Button
                  flex="2"
                  colorScheme="primary"
                  isDisabled={!account?.address || isStakeInfoLoading}
                  onClick={depositDisclosure.onOpen}
                >
                  Deposit
                </Button>
              </Flex>
            </Flex>
          )}
          {!account?.address && (
            <Flex
              flex="1"
              borderRadius="32px"
              p="6"
              gap="6"
              flexDirection="column"
              bgColor="background.primary"
            >
              <Flex flexDirection="column" gap="4">
                <Text color="text.secondary" fontSize="lg">
                  My Position
                </Text>
                <ConnectModal
                  trigger={
                    <Button colorScheme="primary" alignSelf="stretch">
                      Connect Wallet
                    </Button>
                  }
                  open={open}
                  onOpenChange={(isOpen) => setOpen(isOpen)}
                />
              </Flex>
            </Flex>
          )}
        </Flex>
      </VStack>
    </Container>
  );
};

export default PoolBlock;
