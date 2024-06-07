import { IconProps } from '@chakra-ui/react';

import SVG from './svg';

const ArrowUp = (props: IconProps) => {
  return (
    <SVG {...props}>
      <path
        fill="currentColor"
        d="M5.4 16.7125L4 15.2875L12 7.28748L20 15.2875L18.6 16.7125L12 10.1258L5.4 16.7125Z"
      />
    </SVG>
  );
};

export default ArrowUp;
