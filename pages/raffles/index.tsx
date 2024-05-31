import { Box } from '@chakra-ui/react';

import Main from 'components/template/main';
import { SEO } from 'components/utilities';

import NextImage from 'next/image';

import BackgroundImageLeft from 'assets/buck.png';
import BackgroundImageRight from 'assets/raffles_suisca.png';
import BackgroundImageMobile from 'assets/raffles_all.png';

const Raffles = () => {
  return (
    <Box w="full" position="relative" overflowX="clip">
      <SEO />
      <Main />
      {/* mobile backgound image */}
      <Box
        w="full"
        maxW="container.md"
        display={{ base: 'block', lg: 'none' }}
        position="absolute"
        zIndex={-1}
        bottom={{ base: '-12.5rem', md: '-72' }}
        left="50%"
        right="50%"
        transform="translateX(-50%)"
        sx={{
          aspectRatio: 3 / 2,
        }}
      >
        <NextImage
          src={BackgroundImageMobile.src}
          alt="background image"
          fill
        />
      </Box>
      {/* desktop backgound images */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w="full"
        maxW="446px"
        position="absolute"
        top="16"
        right="-10"
        zIndex={-1}
        sx={{
          aspectRatio: 2 / 3,
        }}
      >
        <NextImage src={BackgroundImageRight.src} alt="background image" fill />
      </Box>
      <Box
        display={{ base: 'none', lg: 'block' }}
        w="full"
        maxW="442px"
        position="absolute"
        top="280px"
        left="-24"
        zIndex={-1}
        sx={{
          aspectRatio: 3 / 2,
        }}
      >
        <NextImage src={BackgroundImageLeft.src} alt="background image" fill />
      </Box>
    </Box>
  );
};

export default Raffles;
