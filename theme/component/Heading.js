const headingSizeMap = {
  '3xl': { fontSize: ['4xl', null, '5xl'], fontWeight: 'bold' },
  '2xl': { fontSize: ['2rem', null, '2.5rem'], fontWeight: 'semibold' },
  xl: { fontSize: ['1.75rem', null, '2rem'], fontWeight: 'semibold' },
  lg: { fontSize: ['xl', null, '2xl'], fontWeight: 'semibold' },
  md: { fontSize: ['lg', null, 'xl'], fontWeight: 'semibold' },
};
const getHeadingSize = (as) => {
  switch (as) {
    case 'h1':
      return headingSizeMap['3xl'];
    case 'h2':
      return headingSizeMap['2xl'];
    case 'h3':
      return headingSizeMap['xl'];
    case 'h4':
      return headingSizeMap['lg'];
    case 'h5':
      return headingSizeMap['md'];
    default:
      return headingSizeMap['md'];
  }
};
const Heading = {
  baseStyle: {
    fontWeight: 'semibold',
    fontFamily: 'body',
    color: 'text.primary',
    lineHeight: 1.2,
  },
  sizes: {
    auto: ({ as }) => getHeadingSize(as),
  },
  defaultProps: {
    size: 'auto',
  },
};

export default Heading;
