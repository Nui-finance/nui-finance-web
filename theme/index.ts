import { extendTheme } from '@chakra-ui/react';
import {
  Button,
  Heading,
  Tag,
  Tabs,
  Text,
  Link,
  Tooltip,
  NumberInput,
  Modal,
  Checkbox,
  Skeleton,
} from './component';
import { styles } from './styles';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const theme = extendTheme({
  components: {
    Button,
    Checkbox,
    Heading,
    Tag,
    Tabs,
    Link,
    Tooltip,
    Text,
    NumberInput,
    Modal,
    Skeleton,
  },
  styles,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  breakpoints: {
    sm: '26em',
    md: '48em',
    lg: '70em',
    xl: '96em',
    '2xl': '120em',
  },
  colors: {
    neutral: {
      50: '#F5F6F6',
      100: '#E2E3E4',
      200: '#C5C7CA',
      300: '#B1B5B8',
      400: '#9EA2A6',
      500: '#818488',
      600: '#73777A',
      700: '#47494B',
      800: '#292A2B',
    },
    primary: {
      50: '#E5F4FF',
      100: '#A9D1FF',
      200: '#7EB2FF',
      300: '#538EFF',
      400: '#2660FF',
      500: '#205BCC',
      600: '#184499',
      700: '#102E66',
      800: '#081733',
    },
  },
  fonts: {
    body: `${inter.style.fontFamily}, sans-serif`,
    heading: `${inter.style.fontFamily}, sans-serif`,
  },
  sizes: {
    container: {
      page: '924px',
    },
  },
  semanticTokens: {
    colors: {
      'background.primary': {
        default: '#fff',
      },
      'text.primary': {
        default: 'neutral.800',
      },
      'text.secondary': {
        default: 'neutral.600',
      },
    },
  },
});
