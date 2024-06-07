import {
  Container,
  Flex,
  SimpleGrid,
  VStack,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useMediaQuery,
} from '@chakra-ui/react';
import ConnectButton from '../organism/connect-button';
import { useRouter } from 'next/router';
import { Link, NuiFinanceLogo } from 'components/molecule';
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
} from '@mysten/dapp-kit';
import { useEffect } from 'react';
import {
  Raffles,
  Search,
  Account,
  More,
  OpenInNew,
  ArrowDown,
} from 'components/molecule/icons';
import useGetPoolList from 'applications/query/use-get-pool-list';
import { Pool } from 'applications/type';
import SelectedModal from 'components/organism/selected-modal';
import useGetUserWinnerInfo from 'applications/query/use-get-user-winner-info';

const MoreMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuOptions = [
    {
      label: 'Swap',
      href: 'https://app.cetus.zone/swap/?from=0x2::sui::SUI&to=undefined',
    },
    {
      label: 'Bridge',
      href: 'https://portalbridge.com/',
    },
  ];
  const [isDesktop] = useMediaQuery('(min-width: 768px)');
  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      {isDesktop && (
        <MenuButton
          onClick={onOpen}
          display={{
            base: 'none',
            md: 'flex',
          }}
          color={isOpen ? 'primary.400' : 'text.primary'}
          _hover={{
            color: 'primary.400',
          }}
          as={Button}
          variant="ghost"
          fontSize="md"
          px="2"
          rightIcon={<ArrowDown boxSize="6" />}
          _active={{
            bg: 'transparent',
          }}
        >
          More
        </MenuButton>
      )}
      {!isDesktop && (
        <MenuButton
          onClick={onOpen}
          display={{
            base: 'flex',
            md: 'none',
          }}
        >
          <VStack
            gap="1"
            cursor="pointer"
            color={isOpen ? 'primary.400' : 'neutral.600'}
            _hover={{
              color: isOpen ? 'primary.400' : 'neutral.700',
            }}
          >
            <More boxSize="2rem" />
            <Text fontSize="xs">More</Text>
          </VStack>
        </MenuButton>
      )}
      <MenuList p="2" borderRadius="32px">
        {menuOptions.map((option, index) => (
          <MenuItem
            as={Link}
            target="_blank"
            href={option.href}
            key={index}
            px="3"
            py="4"
            borderRadius="2xl"
          >
            <Flex w="full" gap="2" justifyContent="space-between">
              <Text>{option.label}</Text>
              <OpenInNew />
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

const CheckIsWin = ({ pool }: { pool: Pool }) => {
  const { data: userWinnerInfo, isFetched } = useGetUserWinnerInfo({
    pool,
  });
  const account = useCurrentAccount();
  const selectedDisclosure = useDisclosure();
  const winnerInfoList = userWinnerInfo?.winnerInfoList;
  useEffect(() => {
    if (winnerInfoList?.length > 0) {
      if (
        !localStorage.getItem(
          `${pool.poolId}-${account?.address}-${Number(pool.currentRound) - 1}`,
        )
      ) {
        localStorage.setItem(
          `${pool.poolId}-${account?.address}-${Number(pool.currentRound) - 1}`,
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
    account?.address,
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
    {
      label: 'More',
      icon: <More boxSize="2rem" />,
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
          px="0"
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
              return navOption.path ? (
                <Link
                  href={navOption.path}
                  key={index}
                  fontWeight={isActive ? 'semibold' : 'medium'}
                  px="2"
                  color={isActive ? 'primary.400' : 'neutral.800'}
                >
                  {navOption.label}
                </Link>
              ) : (
                <MoreMenu />
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
        columns={4}
        gap="2"
        bg="neutral.50"
        borderTop="1px solid"
        borderColor="neutral.300"
      >
        {navOptions.map(({ label, icon, path }) => {
          const isActive = router.pathname.match(path);
          return path ? (
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
          ) : (
            <MoreMenu />
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
