import { Box } from '@chakra-ui/react';
import NextImage from 'next/image';

import GovernanceTemplate from 'components/template/governance';
import { SEO } from 'components/utilities';

import BackgroundImage from 'assets/governance.png';

const Governance = () => {
  return (
    <>
      <SEO />
      <GovernanceTemplate />
      {/* backgound image */}
      <Box
        w="full"
        maxW="container.md"
        position="absolute"
        zIndex={-1}
        bottom={{ base: '16', md: '0' }}
        left="50%"
        right="50%"
        transform="translateX(-50%)"
        sx={{
          aspectRatio: 3 / 2,
        }}
      >
        <NextImage src={BackgroundImage.src} alt="background image" fill />
      </Box>
    </>
  );
};

export default Governance;
