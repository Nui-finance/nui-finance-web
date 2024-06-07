import { Button, Text, VStack } from '@chakra-ui/react';
import { ConnectModal } from '@mysten/dapp-kit';
import { useState } from 'react';

const NoWalletConnect = () => {
  const [open, setOpen] = useState(false);

  return (
    <VStack gap="8">
      <VStack gap="0">
        <Text fontSize={{ base: '1.75rem', md: '2rem' }} fontWeight="semibold">
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
  );
};

export default NoWalletConnect;
