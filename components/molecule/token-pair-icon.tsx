import { Box } from '@chakra-ui/react';

import { ProtocolIcon } from 'components/molecule';

const getDefaultTokenOut = (tokenIn: string) => {
  switch (tokenIn) {
    case 'SCALLOP_PROTOCOL_SUI':
      return 'SCALLOP_PROTOCOL_SUI';
    case 'BUCKET_PROTOCOL':
      return 'SCALLOP_PROTOCOL_SUI';
    case 'SCALLOP_PROTOCOL':
      return 'SCALLOP_PROTOCOL';
    default:
      return null;
  }
};

const TokenPairIcon = ({
  size = 'md',
  tokenIn,
  tokenOut,
}: {
  size?: 'md' | 'lg';
  tokenIn: string;
  tokenOut?: string;
}) => {
  const _tokenOut = tokenOut ?? getDefaultTokenOut(tokenIn);
  return (
    <Box position="relative">
      <ProtocolIcon type={tokenIn} boxSize={size === 'md' ? '16' : '24'} />
      <Box
        w={size === 'md' ? '10' : '14'}
        position="absolute"
        right="-4"
        bottom="-2"
        sx={{ aspectRatio: 1 }}
      >
        <ProtocolIcon
          type={_tokenOut}
          position="absolute"
          inset={0}
          boxSize={size === 'md' ? '10' : '14'}
        />
        <Box
          w="full"
          h="full"
          border="3px solid"
          borderColor="background.primary"
          borderRadius="full"
          bgColor="transparent"
          position="absolute"
          inset={0}
        />
      </Box>
    </Box>
  );
};

export default TokenPairIcon;
