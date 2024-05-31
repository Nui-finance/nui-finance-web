import { cssVar, defineStyle, defineStyleConfig } from '@chakra-ui/react';

const $startColor = cssVar('skeleton-start-color');
const $endColor = cssVar('skeleton-end-color');

const baseStyle = defineStyle({
  [$startColor.variable]: 'colors.neutral.100',
  [$endColor.variable]: 'colors.neutral.300',
  _dark: {
    [$startColor.variable]: 'colors.neutral.100',
    [$endColor.variable]: 'colors.neutral.300',
  },
  opacity: 0.7,
  borderRadius: 'lg',
});

export default defineStyleConfig({
  baseStyle,
});
