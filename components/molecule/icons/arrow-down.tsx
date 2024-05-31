import { IconProps } from '@chakra-ui/react';

import SVG from './svg';

const ArrowDown = (props: IconProps) => {
  return (
    <SVG {...props}>
      <path
        fill="currentColor"
        d="M18.6 7.28752L20 8.71252L12 16.7125L4 8.71252L5.4 7.28752L12 13.8742L18.6 7.28752Z"
      />
    </SVG>
  );
};

export default ArrowDown;
