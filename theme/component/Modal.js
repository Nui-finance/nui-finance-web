import { modalAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys);

export default defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    overlay: defineStyle({
      background:
        'linear-gradient(180deg, rgba(245, 246, 246, 0.6) 0%, rgba(229, 244, 255, 0.6) 100%)',
      backdropFilter: 'blur(6px)',
      _dark: {
        background:
          'linear-gradient(180deg, rgba(245, 246, 246, 0.6) 0%, rgba(229, 244, 255, 0.6) 100%)',
      },
    }),
    dialog: defineStyle({
      borderRadius: '2rem',
      backgroundColor: 'background.primary',
      boxShadow: '0px 6px 30px 0px rgba(176, 179, 182, 0.25)',
    }),
    header: defineStyle({
      color: 'text.primary',
    }),
    body: defineStyle({
      color: 'text.primary',
      px: 8,
      pt: 8,
      pb: 4,
    }),
    footer: defineStyle({
      color: 'text.primary',
      px: 8,
      pt: 0,
      pb: 8,
    }),
    closeButton: defineStyle({
      color: 'neutral.600',
    }),
  }),
  defaultProps: {
    //@ts-expect-error - defaultProps is not extendable but the value is accepted
    isCentered: true,
  },
});
