import { numberInputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys);

export default defineMultiStyleConfig({
  defaultProps: {
    size: 'sm',
    variant: 'filled',
    //@ts-expect-error - defaultProps is not extendable but the value is accepted
    errorBorderColor: 'error.400',
  },
  variants: {
    filled: definePartsStyle(() => {
      return {
        field: {
          borderRadius: 'lg',
          borderWidth: '0px',
          borderColor: 'transparent',
          background: 'transparent',
          _hover: {
            background: 'transparent',
          },
          _focus: {
            background: 'transparent',
            borderColor: 'transparent',
          },
        },
      };
    }),
  },
  sizes: {
    sm: {
      field: {
        px: 2,
        py: 0,
      },
    },
    md: {
      field: {
        px: 2,
        py: 0,
      },
    },
  },
});
