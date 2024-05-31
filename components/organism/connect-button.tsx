import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  ConnectModal,
  useAccounts,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useSwitchAccount,
} from '@mysten/dapp-kit';
import { useState } from 'react';
import { formatAddress } from 'utils';
import { Wallet } from 'components/molecule/icons';

const AddressCell = ({ address, ...restProps }) => {
  return (
    <HStack p="4" {...restProps}>
      <Wallet color="primary.400" />
      <Text color="primary.400">{formatAddress(address)}</Text>
    </HStack>
  );
};

const ConnectButton = () => {
  const { mutate: switchAccount } = useSwitchAccount();
  const currentAccount = useCurrentAccount();
  const accounts = useAccounts();
  const { connectionStatus } = useCurrentWallet();

  const { mutate: disconnect } = useDisconnectWallet();
  const [open, setOpen] = useState(false);

  return (
    <>
      {connectionStatus === 'connected' ? (
        <Popover trigger="hover" placement="bottom-end" openDelay={100}>
          <PopoverTrigger>
            <Button
              variant="ghost"
              fontSize="md"
              color="primary.400"
              leftIcon={<Wallet color="primary.400" />}
            >
              {formatAddress(currentAccount?.address)}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            w="fit-content"
            borderRadius="2rem"
            border="none"
            boxShadow="0px 6px 30px 0px rgba(176, 179, 182, 0.25)"
          >
            <PopoverBody as={VStack} p="4">
              {accounts.map((acc) => (
                <AddressCell
                  key={acc?.address}
                  address={acc?.address}
                  cursor="pointer"
                  onClick={() => {
                    const account = accounts?.find(
                      (account) => account?.address === acc?.address,
                    );
                    if (account) {
                      switchAccount({ account });
                    }
                  }}
                />
              ))}
              <Button w="full" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        <ConnectModal
          trigger={
            <Button
              variant="ghost"
              leftIcon={<Wallet color="primary.400" />}
              color="primary.400"
              fontWeight="medium"
              disabled={!!currentAccount}
            >
              {currentAccount ? currentAccount.address : 'Connect'}
            </Button>
          }
          open={open}
          onOpenChange={(isOpen) => setOpen(isOpen)}
        />
      )}
    </>
  );
};

export default ConnectButton;
