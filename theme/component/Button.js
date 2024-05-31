import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const variantSolid = defineStyle((props) => {
  const { colorScheme: c } = props;
  if (c === 'primary') {
    return {
      bgColor: 'primary.400',
      color: 'neutral.50',
      _disabled: {
        bg: 'primary.400',
        opacity: 0.4,
      },
      _hover: {
        bgColor: 'primary.300',
        _disabled: {
          bgColor: 'primary.400',
          opacity: 0.4,
          color: 'neutral.50',
        },
      },
      _active: {
        bgColor: 'primary.300',
        _disabled: {
          bgColor: 'primary.400',
          opacity: 0.4,
          color: 'neutral.50',
        },
      },
    };
  }

  return {
    bgColor: 'neutral.100',
    color: 'neutral.800',
    _disabled: {
      bgColor: 'neutral.100',
      opacity: 0.4,
    },
    _hover: {
      bgColor: 'neutral.200',
      color: 'neutral.800',
      _disabled: {
        bgColor: 'neutral.100',
        opacity: 0.4,
      },
    },
    _active: {
      bgColor: 'neutral.200',
      color: 'neutral.800',
      _disabled: {
        bgColor: 'neutral.100',
        opacity: 0.4,
      },
    },
  };
});

const variantOutline = defineStyle(() => {
  return {
    color: 'neutral.800',
    bgColor: 'transparent',
    borderColor: 'neutral.400',
    _hover: {
      bgColor: 'neutral.100',
    },
    _active: {
      bgColor: 'neutral.200',
    },
    _disabled: {
      opacity: 0.4,
    },
  };
});

const variantGhost = defineStyle(() => {
  return {
    bg: 'transparent',
    color: 'neutral.800',
    _hover: {
      bg: 'neutral.50',
    },
    _active: {
      bg: 'neutral.50',
    },
    _disabled: {
      bg: 'transparent',
      opacity: 0.4,
    },
    _dark: {
      bg: 'transparent',
      color: 'neutral.800',
      _hover: {
        bg: 'rgba(245, 246, 246, 0.4)',
      },
      _active: {
        bg: 'rgba(245, 246, 246, 0.4)',
      },
    },
  };
});

const variantLink = defineStyle(() => {
  return {
    padding: 0,
    height: 'auto',
    lineHeight: 'inherit',
    verticalAlign: 'baseline',
    fontWeight: 'inherit',
    color: 'neutral.800',
    _active: {
      color: 'primary.400',
    },
    _disabled: {
      opacity: 0.4,
    },
    textDecoration: 'none',
    _hover: {
      color: 'primary.400',
      textDecoration: 'none',
    },
  };
});

export default defineStyleConfig({
  baseStyle: {
    borderRadius: 'full',
    fontFamily: 'body',
  },
  variants: {
    solid: variantSolid,
    outline: variantOutline,
    ghost: variantGhost,
    link: variantLink,
  },
  sizes: {
    xs: {
      h: '26px',
      minW: '56px',
      fontSize: 'xs',
      px: '12px',
    },
    sm: {
      h: '32px',
      minW: '32px',
      fontSize: 'xs',
      px: '16px',
    },
    md: {
      h: '40px',
      fontSize: 'md',
      px: '22px',
    },
    lg: {
      h: '52px',
      fontSize: 'lg',
      px: '56px',
    },
    xl: {
      h: '56px',
      fontSize: 'sm',
      fontWeight: 'medium',
      px: '32px',
    },
  },
  defaultProps: {
    size: 'xl',
    variant: 'solid',
  },
});
