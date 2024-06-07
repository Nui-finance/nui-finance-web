import { Box, BoxProps } from '@chakra-ui/react';

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
      return 'SCALLOP_PROTOCOL_SUI';
  }
};

const TokenPairIcon = ({
  size = 'md',
  tokenIn,
  tokenOut,
  hasWhiteBorder = true,
  ...restProps
}: {
  size?: 'xs' | 'md' | 'lg';
  tokenIn: string;
  tokenOut?: string;
  hasWhiteBorder?: boolean;
} & BoxProps) => {
  const boxSizeMap = {
    inIcon: { xs: '6', md: '16', lg: '24' },
    outIcon: { xs: '4', md: '10', lg: '14' },
    right: { xs: '-1', md: '-4', lg: '-4' },
    bottom: { xs: '-1', md: '-2', lg: '-2' },
  };
  const _tokenOut = tokenOut ?? getDefaultTokenOut(tokenIn);
  return (
    <Box position="relative" {...restProps}>
      <ProtocolIcon type={tokenIn} boxSize={boxSizeMap['inIcon'][size]} />
      <Box
        w={boxSizeMap['outIcon'][size]}
        position="absolute"
        right={boxSizeMap['right'][size]}
        bottom={boxSizeMap['bottom'][size]}
        sx={{ aspectRatio: 1 }}
      >
        <ProtocolIcon
          type={_tokenOut}
          position="absolute"
          inset={0}
          boxSize={boxSizeMap['outIcon'][size]}
        />
        {hasWhiteBorder && (
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
        )}
      </Box>
    </Box>
  );
};

export default TokenPairIcon;
