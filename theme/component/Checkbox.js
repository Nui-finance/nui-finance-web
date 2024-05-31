import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    control: defineStyle({
      width: '4',
      height: '4',
      borderRadius: 'sm',
      borderWidth: '2px',
      borderColor: 'neutral.400',
      bg: 'transparent',
      _hover: {
        bg: '#D9D9D9',
      },
      _checked: {
        borderColor: 'primary.500',
        bg: 'transparent',
        color: 'primary.500',
        _hover: {
          borderColor: 'primary.500',
          bg: 'primary.500',
        },
        _disabled: {
          bg: 'transparent',
          borderColor: 'neutral.400',
          opacity: 0.4,
        },
      },
      _disabled: {
        bg: 'transparent',
        borderColor: 'inherit',
        opacity: 0.4,
      },
    }),
  }),
  defaultProps: {
    size: 'lg',
  },
});
