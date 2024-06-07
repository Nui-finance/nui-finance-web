import { ChakraProvider, Container, Flex, LightMode } from '@chakra-ui/react';
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';
import { useEffect, useState } from 'react';
import Header from '../components/template/header';
import { IntlProvider } from 'react-intl';
import { theme } from 'theme';
import Footer from 'components/template/footer';
import { ModalProvider } from 'components/organism/modals';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();
type SuiNetworkType = keyof typeof networkConfig;

export default function App({ Component, pageProps }) {
  const [activeNetwork, setActiveNetwork] = useState<SuiNetworkType>('mainnet');

  useEffect(() => {
    console.info(`[MAIN] ${process.env.NEXT_PUBLIC_VERSION}`);
  }, []);
  return (
    <IntlProvider defaultLocale="en-US" locale="en-US">
      <ChakraProvider theme={theme}>
        <ModalProvider>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider
              networks={networkConfig}
              network={activeNetwork}
              onNetworkChange={(network) => {
                setActiveNetwork(network);
              }}
            >
              <WalletProvider>
                <LightMode>
                  <Container
                    w="full"
                    minH="100vh"
                    minW="full"
                    as={Flex}
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Flex w="full" flexDirection="column">
                      <Header />
                      <Component {...pageProps} />
                    </Flex>
                    <Footer />
                  </Container>
                </LightMode>
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </ModalProvider>
      </ChakraProvider>
    </IntlProvider>
  );
}
