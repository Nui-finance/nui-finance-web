import NextImage from 'next/image';

import { Box } from '@chakra-ui/react';

import MyPositionTemplate from 'components/template/my-position';
import { SEO } from 'components/utilities';
import BackgroundImage from 'assets/my_position.png';

const MyPosition = () => {
  return (
    <>
      <SEO />
      <MyPositionTemplate />
      <Box
        w="full"
        maxW="container.md"
        position="absolute"
        zIndex={-1}
        bottom={{ base: '16', md: '-44' }}
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

export default MyPosition;
