import {
  Button,
  Center,
  Flex,
  HStack,
  Text,
  VStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Skeleton,
  useDisclosure,
} from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useDrawLottery } from 'applications/mutation';
import useGetPoolList from 'applications/query/use-get-pool-list';
import useGetUserWinnerInfo from 'applications/query/use-get-user-winner-info';
import { Pool } from 'applications/type';

import { ProtocolIcon } from 'components/molecule';
import ResultModal from 'components/organism/result-modal';
import SelectedModal from 'components/organism/selected-modal';
import { useEffect, useState } from 'react';
import { PoolTypeEnum } from 'sui-api-final-v2';
import useCountdown from 'utils/use-countdown';

let revealing = false;

type PoolRevealProps = {
  pools: (Pool & {
    isDisable: boolean;
  })[];
};

const usePools = (data: Pool[]): PoolRevealProps => {
  const account = useCurrentAccount();

  const pools = data?.map((pool) => {
    const isDisable = !account?.address || !pool?.canAllocateReward;

    return {
      ...pool,
      isDisable,
    };
  });

  return { pools };
};

const RevealButton = ({ poolType }: { poolType: PoolTypeEnum }) => {
  const [drawResult, setDrawResult] = useState();
  const [revealed, setRevealed] = useState(false);
  const drawDisclosure = useDisclosure();
  const winDisclosure = useDisclosure();
  const loseDisclosure = useDisclosure();
  const {
    data: pools,
    isStale: isPoolListStale,
    isPending: isPoolListPending,
  } = useGetPoolList();

  // const { refetch: refetchAllPool } = useGetPoolList();
  const pool = pools.find((p) => p.poolType === poolType);

  const {
    data: userWinnerInfo,
    isStale: isWinnerInfoStale,
    isPending: isWinnerInfoPending,
  } = useGetUserWinnerInfo({
    pool,
  });

  const { mutate: drawLottery, isPending } = useDrawLottery({
    poolType,
    onSuccess: async (data: any) => {
      setDrawResult(data);
      drawDisclosure.onOpen();
      setRevealed(true);
    },
    onSettled: () => {
      revealing = false;
    },
  });
  if (pool.poolType === PoolTypeEnum.SCALLOP_PROTOCOL_SUI) {
  }
  useEffect(() => {
    if (revealed && !isPoolListStale && !isWinnerInfoStale) {
      if (
        !!userWinnerInfo?.winnerInfoList &&
        !(userWinnerInfo?.winnerInfoList?.length > 0)
      ) {
        loseDisclosure.onOpen();
        setRevealed(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, userWinnerInfo, isPoolListStale, isWinnerInfoStale]);

  const rewardTime =
    Number(pool?.timeInfo?.rewardDuration) * 1000 +
    Number(pool?.timeInfo?.startTime);
  const countdown = useCountdown(rewardTime);
  const canReveal = Date.now() > rewardTime;
  return (
    <>
      {canReveal ? (
        <Button
          colorScheme="primary"
          variant="solid"
          w={{ base: 'auto', md: 'full' }}
          h={{ base: '14', md: '46px' }}
          isDisabled={!canReveal}
          onClick={() => {
            if (revealing) return;
            revealing = true;
            drawLottery(pool?.poolId);
          }}
          isLoading={isPending || isWinnerInfoPending || isPoolListPending}
        >
          Reveal
        </Button>
      ) : (
        <Button
          colorScheme="neutral"
          variant="solid"
          w={{ base: 'auto', md: 'full' }}
          h={{ base: '14', md: '46px' }}
          isDisabled={true}
          isLoading={isPending || isWinnerInfoPending}
        >
          Reveal in {countdown}
        </Button>
      )}
      <ResultModal
        type="REWARD"
        result={drawResult}
        pool={pool}
        {...drawDisclosure}
        onClose={async () => {
          drawDisclosure.onClose();
        }}
      />
      <ResultModal
        type="UNSELECTED"
        pool={pool}
        {...loseDisclosure}
        onClose={() => {
          loseDisclosure.onClose();
        }}
      />
      <SelectedModal
        pool={pool}
        winnerInfoList={userWinnerInfo?.winnerInfoList}
        {...winDisclosure}
      />
    </>
  );
};

const Governance = () => {
  const { data, isLoading } = useGetPoolList();
  const { pools } = usePools(data);

  return (
    <Center
      maxW="container.page"
      px={{ base: '4', md: '8' }}
      pt="8"
      mx="auto"
      flexDirection="column"
      gap="4"
    >
      <VStack
        p="8"
        align="flex-start"
        bg="background.primary"
        borderRadius="2xl"
        alignSelf="stretch"
      >
        <Text fontSize={{ base: '1.75rem', md: '2rem' }} fontWeight="semibold">
          Governance
        </Text>
        <Text fontSize="sm" color="text.secondary">
          Our governance model ensures transparent, inclusive, and fair
          decision-making processes. You can reveal the winners now, with more
          to come.
        </Text>
      </VStack>
      <VStack
        p="8"
        align="flex-start"
        gap="4"
        bg="background.primary"
        borderRadius="2xl"
        alignSelf="stretch"
      >
        <VStack align="flex-start">
          <Text
            fontSize={{ base: '1.75rem', md: '2rem' }}
            fontWeight="semibold"
          >
            Reveal to Earn
          </Text>
          <Text fontSize="sm" color="text.secondary">
            You can get bonus rewards when you are the first one to hit the
            reveal button.
          </Text>
        </VStack>
        {isLoading ? (
          <VStack alignSelf="stretch">
            {Array.from(Array(3)).map((_, i) => (
              <Skeleton key={i} w="full" h={{ base: '20', md: '14' }} />
            ))}
          </VStack>
        ) : (
          <>
            {/* mobile UI */}
            <VStack
              display={{ base: 'flex', md: 'none' }}
              gap="4"
              alignSelf="stretch"
            >
              {pools?.map((pool, index) => {
                return (
                  <Flex
                    key={index}
                    display={{ base: 'flex', md: 'none' }}
                    direction="column"
                    align="stretch"
                    gap="2"
                    alignSelf="stretch"
                  >
                    <HStack>
                      <ProtocolIcon type={pool?.poolType} />
                      <Text fontSize="sm">{`${pool?.rewardAmount} ${pool?.stakeCoinName}`}</Text>
                      <Text
                        ml="auto"
                        fontSize="sm"
                      >{`#${pool?.currentRound}`}</Text>
                    </HStack>
                    <RevealButton poolType={pool?.poolType} />
                  </Flex>
                );
              })}
            </VStack>
            {/* desktop UI */}
            <TableContainer w="full" display={{ base: 'none', md: 'block' }}>
              <Table variant="simple">
                <Thead>
                  <Tr
                    sx={{
                      '& > Th': {
                        border: 'none',
                        p: 0,
                        pb: '2',
                      },
                    }}
                  >
                    {['Pool', 'Week', 'Prize', 'Reveal'].map((th) => (
                      <Th
                        key={th}
                        fontSize="sm"
                        fontWeight="normal"
                        color="text.secondary"
                        textTransform="capitalize"
                      >
                        {th}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {pools?.map((pool) => (
                    <Tr
                      key={pool?.poolType}
                      display={{ base: 'none', md: 'table-row' }}
                      sx={{
                        '& > Td': {
                          border: 'none',
                          px: 0,
                          py: '2',
                        },
                      }}
                    >
                      <Td>
                        <HStack>
                          <ProtocolIcon type={pool?.poolType} />
                          <Text fontSize="sm">{pool?.stakeCoinName}</Text>
                        </HStack>
                      </Td>
                      <Td>{`#${pool?.currentRound}`}</Td>
                      <Td>{`${pool?.rewardAmount} ${pool?.rewardCoinName}`}</Td>
                      <Td>
                        <RevealButton poolType={pool?.poolType} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        )}
      </VStack>
    </Center>
  );
};

export default Governance;
