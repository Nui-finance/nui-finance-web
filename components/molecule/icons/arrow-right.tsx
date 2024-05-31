import { IconProps } from '@chakra-ui/react';

import SVG from './svg';

const ArrowRight = (props: IconProps) => {
  return (
    <SVG {...props}>
      <path
        d="M13.9423 17.3078L13.2345 16.5885L17.323 12.5H5.25V11.5H17.323L13.2345 7.41151L13.9423 6.69226L19.25 12L13.9423 17.3078Z"
        fill="currentColor"
      />
    </SVG>
  );
};

export default ArrowRight;
