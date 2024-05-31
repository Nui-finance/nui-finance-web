import { IconProps } from '@chakra-ui/react';

import SVG from './svg';

const ArrowLeft = (props: IconProps) => {
  return (
    <SVG {...props}>
      <path
        d="M10.4037 17.8076L5.09619 12.4999L10.4037 7.19214L11.1114 7.91139L7.02294 11.9999H19.9037V12.9999H7.02294L11.1114 17.0884L10.4037 17.8076Z"
        fill="currentColor"
      />
    </SVG>
  );
};

export default ArrowLeft;
