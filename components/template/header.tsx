import {
  Container,
  Flex,
  SimpleGrid,
  VStack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import ConnectButton from '../organism/connect-button';
import { useRouter } from 'next/router';
import { Link, NuiFinanceLogo } from 'components/molecule';
import { useConnectWallet, useWallets } from '@mysten/dapp-kit';
import { useEffect } from 'react';
import { Raffles, Search, Account } from 'components/molecule/icons';
import useGetPoolList from 'applications/query/use-get-pool-list';
import { Pool } from 'applications/type';
import SelectedModal from 'components/organism/selected-modal';
import useGetUserWinnerInfo from 'applications/query/use-get-user-winner-info';

const CheckIsWin = ({ pool }: { pool: Pool }) => {
  const { data: userWinnerInfo, isFetched } = useGetUserWinnerInfo({
    pool,
  });
  const selectedDisclosure = useDisclosure();
  const winnerInfoList = userWinnerInfo?.winnerInfoList;
  useEffect(() => {
    if (winnerInfoList?.length > 0) {
      if (
        !localStorage.getItem(`${pool.poolId}-${Number(pool.currentRound) - 1}`)
      ) {
        localStorage.setItem(
          `${pool.poolId}-${Number(pool.currentRound) - 1}`,
          'true',
        );
        selectedDisclosure.onOpen();
      }
    }
  }, [
    pool.currentRound,
    pool.poolId,
    userWinnerInfo,
    selectedDisclosure,
    winnerInfoList?.length,
    isFetched,
  ]);
  return (
    <SelectedModal
      pool={pool}
      winnerInfoList={winnerInfoList}
      {...selectedDisclosure}
    />
  );
};

const Header = () => {
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  useEffect(() => {
    if (wallets.length > 0) {
      connect({
        wallet: wallets[0],
      });
    }
  }, [wallets, connect]);
  const router = useRouter();
  const navOptions = [
    {
      label: 'Raffles',
      path: '/raffles',
      icon: <Raffles boxSize="2rem" />,
    },
    {
      label: 'Governance',
      path: '/governance',
      icon: <Search boxSize="2rem" />,
    },
    {
      label: 'My Position',
      path: '/my-position',
      icon: <Account boxSize="2rem" />,
    },
  ];

  const { data: pools } = useGetPoolList();

  return (
    <>
      <Flex
        w="full"
        h="56px"
        mt="8"
        position="sticky"
        top={0}
        zIndex="docked"
        bg="var(--chakra-colors-primary-50)"
      >
        <Container
          as={Flex}
          alignItems="center"
          justifyContent="space-between"
          maxW="container.page"
          px={{ base: '4', md: '8' }}
        >
          <Link href="/">
            <NuiFinanceLogo />
          </Link>
          {/* Desktop Nav UI */}
          <Flex
            display={{ base: 'none', md: 'flex' }}
            alignItems="center"
            gap="2"
          >
            {navOptions.map((navOption, index) => {
              const isActive = router.pathname.match(navOption.path);
              return (
                <Link
                  href={navOption.path}
                  key={index}
                  fontWeight={isActive ? 'semibold' : 'medium'}
                  px="2"
                  color={isActive ? 'primary.400' : 'neutral.800'}
                >
                  {navOption.label}
                </Link>
              );
            })}
          </Flex>
          <ConnectButton />
        </Container>
      </Flex>
      {/* Mobile Nav UI */}
      <SimpleGrid
        display={{ base: 'grid', md: 'none' }}
        position="fixed"
        bottom={0}
        right={0}
        left={0}
        zIndex="docked"
        p="3"
        columns={3}
        gap="2"
        bg="neutral.50"
        borderTop="1px solid"
        borderColor="neutral.300"
      >
        {navOptions.map(({ label, icon, path }) => {
          const isActive = router.pathname.match(path);
          return (
            <Link key={label} href={path}>
              <VStack
                gap="1"
                cursor="pointer"
                color={isActive ? 'primary.400' : 'neutral.600'}
                _hover={{
                  color: isActive ? 'primary.400' : 'neutral.700',
                }}
              >
                {icon}
                <Text fontSize="xs">{label}</Text>
              </VStack>
            </Link>
          );
        })}
      </SimpleGrid>
      {pools?.map((pool, index) => {
        return <CheckIsWin key={index} pool={pool} />;
      })}
    </>
  );
};

export default Header;
