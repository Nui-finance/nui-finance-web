import { menuAnatomy } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  defineStyleConfig,
} from '@chakra-ui/react';

const { definePartsStyle } = createMultiStyleConfigHelpers(menuAnatomy.keys);

export default defineStyleConfig({
  baseStyle: definePartsStyle({
    list: {
      boxShadow: '0px 6px 30px 0px rgba(176, 179, 182, 0.25)',
    },
    item: {
      bg: 'transparent',
      fontWeight: 'bold',
      _hover: {
        bg: 'neutral.100',
      },
    },
  }),
});
