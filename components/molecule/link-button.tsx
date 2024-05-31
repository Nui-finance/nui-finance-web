import { forwardRef } from 'react';

import { Button, ButtonProps } from '@chakra-ui/react';
import Link, { LinkProps } from 'next/link';

const LinkButton = forwardRef<HTMLButtonElement, ButtonProps & LinkProps>(
  function LinkButton(
    {
      children,
      variant = 'ghost',
      colorScheme = 'neutral',
      isDisabled = false,
      ...props
    },
    ref,
  ) {
    const isOpenInNewTab = /^https:\/\//.test(props?.href?.toString());
    // const rightIcon = isOpenInNewTab
    //   ? {
    //       rightIcon: <Icons.OpenInNew boxSize="1em" />,
    //     }
    //   : {};
    return (
      <Button
        ref={ref}
        as={Link}
        variant={variant}
        colorScheme={colorScheme}
        isDisabled={isDisabled}
        target={isOpenInNewTab ? '_blank' : '_self'}
        // {...rightIcon}
        {...props}
        {...(isDisabled && {
          onClick: (e) => {
            e.preventDefault();
          },
        })}
      >
        {children}
      </Button>
    );
  },
);

export default LinkButton;
