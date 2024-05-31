import {
  HStack,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Skeleton,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import { LinkButton, ProtocolCell, ProtocolIcon } from 'components/molecule';
import { OpenInNew } from 'components/molecule/icons';

import { formatAddress, useIntl } from 'utils';

const RecentWinner = ({ items, isLoading }) => {
  const { formatPrice } = useIntl();
  return (
    <>
      <Box
        display={{ base: 'none', md: 'block' }}
        maxH="20rem"
        overflowY="auto"
        alignSelf="stretch"
      >
        {isLoading ? (
          <VStack>
            {Array.from(Array(8)).map((_, i) => (
              <Skeleton key={i} w="full" h="8" />
            ))}
          </VStack>
        ) : (
          <TableContainer w="full">
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
                  {['Pool', 'Week', 'Prize', 'Winner'].map((th) => (
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
                {items?.map(
                  ({ poolType, round, coinName, reward, address }, index) => (
                    <Tr
                      key={index}
                      sx={{
                        '& > Td': {
                          border: 'none',
                          px: 0,
                          py: '2',
                        },
                      }}
                    >
                      <Td>
                        <ProtocolCell type={poolType} />
                      </Td>
                      <Td>{`#${round}`}</Td>
                      <Td>
                        <Tooltip
                          label={`${reward} ${coinName}`}
                          isDisabled={reward > 0.001}
                          shouldWrapChildren
                        >
                          {formatPrice(reward)} {coinName}
                        </Tooltip>
                      </Td>
                      <Td>
                        {/* <LinkButton
                          href="#"
                          variant="link"
                          rightIcon={<OpenInNew boxSize="1rem" />}
                        >
                          {formatAddress(address)}
                        </LinkButton> */}
                        <Tooltip label={address} shouldWrapChildren>
                          <Text>{formatAddress(address)}</Text>
                        </Tooltip>
                      </Td>
                    </Tr>
                  ),
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <VStack
        display={{ base: 'flex', md: 'none' }}
        maxH="20rem"
        overflowY="auto"
        alignSelf="stretch"
      >
        {isLoading
          ? Array.from(Array(8)).map((_, i) => (
              <Skeleton key={i} w="full" h="8" />
            ))
          : items?.map(
              ({ poolType, round, coinName, reward, address }, index) => (
                <HStack
                  key={index}
                  alignSelf="stretch"
                  justifyContent="space-between"
                >
                  <HStack flexWrap="wrap">
                    <ProtocolIcon type={poolType} />
                    <Text>
                      {formatPrice(reward)} {coinName}
                    </Text>
                    <Text>{`#${round}`}</Text>
                  </HStack>
                  <LinkButton
                    href="#"
                    variant="link"
                    rightIcon={<OpenInNew boxSize="1rem" />}
                  >
                    {formatAddress(address)}
                  </LinkButton>
                </HStack>
              ),
            )}
      </VStack>
    </>
  );
};

export default RecentWinner;
