import { Dispatch, SetStateAction, use, useEffect, useState } from 'react';
import {
  Container,
  Flex,
  HStack,
  Heading,
  Skeleton,
  Tag,
  Text,
  VStack,
  Button,
  Tooltip,
  // useDisclosure,
} from '@chakra-ui/react';
import { poolCoin } from 'applications/constants';

import {
  Link,
  ProtocolIcon,
  LinkButton,
  ProtocolCell,
} from 'components/molecule';

import { useCurrentAccount, ConnectModal } from '@mysten/dapp-kit';
import { Pool } from 'applications/type';
import { ArrowRight } from 'components/molecule/icons';
import { useIntl } from 'utils';
import useGetPoolList from 'applications/query/use-get-pool-list';
import useGetUsdRate from 'applications/query/use-get-usd-rate';
import useGetAllPosition from 'applications/query/use-get-all-position';
import useGetWinnerHistory from 'applications/query/use-get-winner-history';
import useGetUserStakeInfo from 'applications/query/use-get-user-stake-info';
import useGetUserWinnerInfo from 'applications/query/use-get-user-winner-info';

const PoolPosition = ({ pool }: { pool: Pool }) => {
  const { poolType } = pool ?? {};

  const { formatUSD, formatBalance } = useIntl();

  const { data: userStakeInfo, isLoading } = useGetUserStakeInfo({
    pool,
  });
  const { data: rateInfo } = useGetUsdRate({
    poolType: pool?.poolType,
  });

  return (
    <Link
      href={`/raffles/${poolType}`}
      display={
        userStakeInfo?.userStakeTotalAmount > 0 || isLoading ? 'flex' : 'none'
      }
    >
      <Flex w="full" py="4" justifyContent="space-between" alignItems="center">
        <Skeleton isLoaded={!isLoading}>
          <ProtocolCell type={poolType} />
        </Skeleton>
        <Flex gap="1">
          <Skeleton isLoaded={!isLoading}>
            <Text fontSize="sm">
              {userStakeInfo?.userStakeTotalAmount
                ? formatBalance(userStakeInfo?.userStakeTotalAmount)
                : '--'}{' '}
              {poolCoin[poolType]?.name}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <Text fontSize="sm" color="text.secondary">
              {rateInfo?.stakeCoinUsdRate
                ? formatUSD(
                    Number(rateInfo?.stakeCoinUsdRate) *
                      userStakeInfo?.userStakeTotalAmount,
                  )
                : '$--'}
            </Text>
          </Skeleton>
        </Flex>
      </Flex>
    </Link>
  );
};

const ClaimableBar = ({ pool }: { pool: Pool }) => {
  const { data: userWinnerInfo } = useGetUserWinnerInfo({
    pool,
  });
  const isWin = userWinnerInfo?.winnerInfoList?.length > 0;
  return (
    <Flex
      justifyContent="space-between"
      alignSelf="stretch"
      wrap="wrap"
      w="full"
      py="4"
      px="8"
      bg="primary.100"
      borderRadius="2rem"
      display={isWin ? 'flex' : 'none'}
    >
      <HStack>
        <ProtocolIcon type={pool.poolType} />
        <Text fontSize="sm">{`#week ${Number(pool.currentRound) - 1}`}</Text>
      </HStack>
      <Link href={`/raffles/${pool.poolType}`}>
        <HStack>
          <Text fontSize="sm">You have claimable win</Text>
          <ArrowRight />
        </HStack>
      </Link>
    </Flex>
  );
};

const Win = ({ poolType, round, coinName, reward }) => {
  const { data: rateInfo } = useGetUsdRate({
    poolType,
  });
  const { formatUSD, formatPrice } = useIntl();
  return (
    <Flex
      py="4"
      key={poolType}
      justifyContent="space-between"
      alignItems="center"
      gap="2"
      alignSelf="stretch"
    >
      <HStack>
        <ProtocolIcon type={poolType} />
        <Text fontSize="sm">{`#week ${round}`}</Text>
      </HStack>
      <HStack>
        <Tooltip
          label={`${reward} ${coinName}`}
          isDisabled={Number(reward) > 0.001}
          shouldWrapChildren
        >
          <Text fontSize="sm">
            {formatPrice(reward)} {coinName}
          </Text>
        </Tooltip>
        <Text fontSize="sm" color="text.secondary">
          {formatUSD(reward * Number(rateInfo?.stakeCoinUsdRate))}
        </Text>
      </HStack>
    </Flex>
  );
};

const MyPosition = () => {
  const { data: pools } = useGetPoolList();
  // const depositDisclosure = useDisclosure();
  const account = useCurrentAccount();
  const { formatUSD } = useIntl();
  const [open, setOpen] = useState(false);

  const { data: winners, isPending: isWinsLoading } = useGetWinnerHistory();
  const myWins = winners?.filter(
    (winner) => winner?.address === account?.address,
  );
  const { data: allPosition, isPending: isAllpositionLoading } =
    useGetAllPosition();
  const positionNum = allPosition?.reduce((acc, current) => {
    return current.userStakeTotalAmount > 0 ? acc + 1 : acc;
  }, 0);

  const totalUsd = allPosition?.reduce((acc, current) => {
    if (!current?.userStakeTotalAmount) {
      return acc;
    }
    return (
      acc + current.userStakeTotalAmount * Number(current?.stakeCoinUsdRate)
    );
  }, 0);
  const totalWinsUSD = myWins?.reduce((acc, current) => {
    if (!Number(current?.reward)) {
      return acc;
    }
    return acc + Number(current.reward);
  }, 0);

  return (
    <Container
      maxW="container.page"
      px={{ base: 4, md: 8 }}
      pt="8"
      as={Flex}
      flexDirection="column"
      gap="4"
      alignItems="center"
    >
      {account?.address ? (
        <>
          <Flex w="full" flexDirection="column" gap="2">
            {pools?.map((pool, index) => {
              return <ClaimableBar key={index} pool={pool} />;
            })}
          </Flex>
          <Flex gap="4" w="full" direction={{ base: 'column', md: 'row' }}>
            <Flex
              flex="1"
              borderRadius="32px"
              p="8"
              gap="4"
              flexDirection="column"
              bgColor="background.primary"
              alignSelf={{ base: 'stretch', md: 'self-start' }}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text color="text.secondary" fontSize="lg">
                  Total Deposit
                </Text>
                <Tag borderRadius="full">{positionNum}</Tag>
              </Flex>
              <Skeleton
                isLoaded={!isAllpositionLoading}
                w={isAllpositionLoading ? '60%' : 'full'}
              >
                <Heading as="h2" fontSize={{ base: '2rem', md: '40px' }}>
                  {totalUsd ? `~ ${formatUSD(totalUsd)}` : '--'}
                </Heading>
              </Skeleton>
              {isAllpositionLoading ? (
                <VStack>
                  {Array.from(Array(3)).map((_, i) => (
                    <Skeleton key={i} w="full" h="14" />
                  ))}
                </VStack>
              ) : (
                <Flex flexDirection="column" w="full">
                  {pools?.length ? (
                    pools?.map((pool) => {
                      return <PoolPosition pool={pool} key={pool?.poolId} />;
                    })
                  ) : (
                    <VStack alignSelf="stretch" gap="4">
                      <Text fontSize="sm" color="text.secondary">
                        We offer a variety of draws with different token prizes.
                        Check them out before the current rounds close.
                      </Text>
                      <LinkButton
                        href="#"
                        variant="solid"
                        colorScheme="primary"
                        rightIcon={<ArrowRight boxSize="2rem" />}
                        alignSelf="stretch"
                      >
                        Check Draws
                      </LinkButton>
                    </VStack>
                  )}
                </Flex>
              )}
            </Flex>
            <Flex
              flex="1"
              borderRadius="32px"
              p="8"
              gap="4"
              flexDirection="column"
              bgColor="background.primary"
              alignSelf="stretch"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text color="text.secondary" fontSize="lg">
                  Total Wins
                </Text>
                <Tag borderRadius="full">{myWins?.length}</Tag>
              </Flex>
              <Skeleton
                isLoaded={!isWinsLoading}
                w={isWinsLoading ? '60%' : 'full'}
              >
                <Heading as="h2" fontSize={{ base: '2rem', md: '40px' }}>
                  {`~ ${formatUSD(totalWinsUSD)}`}
                </Heading>
              </Skeleton>
              {isWinsLoading ? (
                <VStack>
                  {Array.from(Array(3)).map((_, i) => (
                    <Skeleton key={i} w="full" h="14" />
                  ))}
                </VStack>
              ) : myWins?.length ? (
                <VStack>
                  {myWins?.map((win, index) => <Win key={index} {...win} />)}
                </VStack>
              ) : (
                <Text fontSize="sm" color="text.secondary">
                  You haven’t won any now.
                </Text>
              )}
            </Flex>
          </Flex>
        </>
      ) : (
        <VStack gap="8">
          <VStack gap="0">
            <Text
              fontSize={{ base: '1.75rem', md: '2rem' }}
              fontWeight="semibold"
            >
              No Wallet Connected
            </Text>
            <Text fontSize="sm" color="text.secondary">
              Start earning by connecting your wallet.
            </Text>
          </VStack>
          <ConnectModal
            trigger={
              <Button colorScheme="primary" alignSelf="stretch">
                Connect Wallet
              </Button>
            }
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
          />
        </VStack>
      )}
    </Container>
  );
};

export default MyPosition;
