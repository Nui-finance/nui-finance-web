import { Box } from '@chakra-ui/react';

import PoolBlock from 'components/template/pool';
import { SEO } from 'components/utilities';

import NextImage from 'next/image';

import BackgroundSui from 'assets/sui.png';
import BackgroundSCA from 'assets/sca.png';
import BackgroundBuck from 'assets/buck.png';
import { PoolTypeEnum } from 'sui-api-final-v2';
import { poolPageName } from 'applications/constants';

export const getServerSideProps = async ({
  params: { raffle },
}: {
  params: { raffle: string };
}) => {
  let protocol: PoolTypeEnum | undefined;
  switch (raffle) {
    case poolPageName.SCALLOP_PROTOCOL_SUI:
      protocol = PoolTypeEnum.SCALLOP_PROTOCOL_SUI;
      break;
    case poolPageName.BUCKET_PROTOCOL:
      protocol = PoolTypeEnum.BUCKET_PROTOCOL;
      break;
    case poolPageName.SCALLOP_PROTOCOL:
      protocol = PoolTypeEnum.SCALLOP_PROTOCOL;
      break;
    default:
      return 'Invalid raffle';
  }
  try {
    const getBgImage = () => {
      switch (protocol) {
        case PoolTypeEnum.BUCKET_PROTOCOL:
          return BackgroundBuck.src;
        case PoolTypeEnum.SCALLOP_PROTOCOL:
          return BackgroundSCA.src;
        case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
          return BackgroundSui.src;
        default:
          return '';
      }
    };
    return {
      props: {
        protocol,
        bgImageUrl: getBgImage(),
      },
    };
  } catch (error: unknown) {
    if (typeof error === 'string') {
      return error;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'An error occurred. Please try again later.';
    }
  }
};

export default function template({ protocol, bgImageUrl }) {
  return (
    <>
      <SEO />
      <PoolBlock poolType={protocol} />
      {/* backgound image */}
      <Box
        w="full"
        maxW="container.md"
        position="absolute"
        zIndex={-1}
        bottom={{ base: '130px', md: '0' }}
        left="50%"
        right="50%"
        transform="translateX(-50%)"
        sx={{
          aspectRatio: 3 / 2,
        }}
      >
        {protocol && bgImageUrl && (
          <NextImage src={bgImageUrl} alt="background image" fill />
        )}
      </Box>
    </>
  );
}
