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
  TextProps,
} from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { poolCoin } from 'applications/constants';
import { useDrawLottery } from 'applications/mutation';
import useGetPoolList from 'applications/query/use-get-pool-list';
import useGetUserWinnerInfo from 'applications/query/use-get-user-winner-info';

import { ProtocolIcon } from 'components/molecule';
import { useModal } from 'components/organism/modals';
import SelectedModal from 'components/organism/selected-modal';
import { useEffect, useRef } from 'react';
import { PoolTypeEnum } from 'sui-api-final-v2';
import { roundNumber } from 'utils';
import useCountdown from 'utils/use-countdown';

const revealed = {
  [PoolTypeEnum.SCALLOP_PROTOCOL_SUI]: false,
  [PoolTypeEnum.BUCKET_PROTOCOL]: false,
  [PoolTypeEnum.SCALLOP_PROTOCOL]: false,
};

const tableContentTextProps = {
  fontSize: 'sm',
  color: 'text.primary',
  fontWeight: 'medium',
} as TextProps;

const RevealButton = ({ poolType }: { poolType: PoolTypeEnum }) => {
  const winDisclosure = useDisclosure();
  const account = useCurrentAccount();
  const { data: pools } = useGetPoolList();
  const revealing = useRef(false);

  const { loseOpen, drawOpen } = useModal();

  // const { refetch: refetchAllPool } = useGetPoolList();
  const pool = pools?.find((p) => p.poolType === poolType);

  const { data: userWinnerInfo, isPending: isWinnerInfoPending } =
    useGetUserWinnerInfo({
      pool,
    });

  const { mutate: drawLottery, isPending } = useDrawLottery({
    poolType,
    onSuccess: (data: any) => {
      revealed[poolType] = true;
      drawOpen({
        pool,
        result: data,
      });
    },
    onSettled: () => {
      revealing.current = false;
    },
  });
  useEffect(() => {
    if (revealed[poolType] && !!userWinnerInfo) {
      if (userWinnerInfo?.winnerInfoList.length === 0) {
        loseOpen({
          pool,
        });
      }
      revealed[poolType] = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, userWinnerInfo]);

  const rewardTime =
    Number(pool?.timeInfo?.rewardDuration) * 1000 +
    Number(pool?.timeInfo?.startTime);
  const countdown = useCountdown(rewardTime);
  const canReveal = Date.now() > rewardTime;

  const isRevealButtonPending =
    isPending || (isWinnerInfoPending && !!account?.address);
  return (
    <>
      {canReveal ? (
        <Button
          colorScheme="primary"
          variant="solid"
          w={{ base: 'auto', md: 'full' }}
          h={{ base: '14', md: '46px' }}
          isDisabled={!canReveal || !account?.address}
          onClick={() => {
            if (revealing.current) return;
            revealing.current = true;
            drawLottery(pool?.poolId);
          }}
          isLoading={isRevealButtonPending}
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
          isLoading={isRevealButtonPending}
        >
          Reveal in {countdown}
        </Button>
      )}
      <SelectedModal
        pool={pool}
        winnerInfoList={userWinnerInfo?.winnerInfoList}
        {...winDisclosure}
      />
    </>
  );
};

const MobileRevealBlock = ({ poolType }: { poolType: PoolTypeEnum }) => {
  const { data, isLoading } = useGetPoolList();
  const pool = data?.find((p) => p.poolType === poolType);
  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      direction="column"
      align="stretch"
      gap="2"
      alignSelf="stretch"
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Flex gap="2" alignItems="center">
          <Skeleton isLoaded={!isLoading}>
            <ProtocolIcon type={pool?.poolType} />
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <Text fontSize="sm">{`${roundNumber(pool?.rewardAmount, 3)} ${pool?.stakeCoinName}`}</Text>
          </Skeleton>
        </Flex>
        <Skeleton isLoaded={!isLoading}>
          <Text ml="auto" fontSize="sm">{`#${pool?.currentRound}`}</Text>
        </Skeleton>
      </HStack>
      <RevealButton poolType={pool?.poolType} />
    </Flex>
  );
};

const DesktopRevealBlock = ({ poolType }: { poolType: PoolTypeEnum }) => {
  const { data, isLoading } = useGetPoolList();
  const pool = data?.find((p) => p.poolType === poolType);
  return (
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
          <ProtocolIcon type={poolType} />
          <Text {...tableContentTextProps}>{poolCoin[poolType].name}</Text>
        </HStack>
      </Td>
      <Td>
        <Skeleton w={isLoading ? '12' : 'auto'} isLoaded={!isLoading}>
          <Text {...tableContentTextProps}>{`#${pool?.currentRound}`}</Text>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton w={isLoading ? '24' : 'auto'} isLoaded={!isLoading}>
          <Text {...tableContentTextProps}>
            {`${roundNumber(pool?.rewardAmount, 3)} ${pool?.rewardCoinName}`}
          </Text>
        </Skeleton>
      </Td>
      <Td>
        <RevealButton poolType={pool?.poolType} />
      </Td>
    </Tr>
  );
};

const Governance = () => {
  const pools = [
    PoolTypeEnum.SCALLOP_PROTOCOL_SUI,
    PoolTypeEnum.BUCKET_PROTOCOL,
    PoolTypeEnum.SCALLOP_PROTOCOL,
  ];
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
        <>
          {/* mobile UI */}
          <VStack
            display={{ base: 'flex', md: 'none' }}
            gap="4"
            alignSelf="stretch"
          >
            {pools?.map((poolType) => {
              return <MobileRevealBlock key={poolType} poolType={poolType} />;
            })}
          </VStack>
          {/* desktop UI */}
          <TableContainer w="full" display={{ base: 'none', md: 'block' }}>
            <Table
              variant="simple"
              __css={{ 'table-layout': 'fixed', width: 'full' }}
            >
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
                      fontWeight="medium"
                      color="text.secondary"
                      textTransform="capitalize"
                    >
                      {th}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {pools?.map((poolType) => (
                  <DesktopRevealBlock key={poolType} poolType={poolType} />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      </VStack>
    </Center>
  );
};

export default Governance;
