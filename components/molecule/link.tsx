import { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import Link, { LinkProps } from 'next/link';
import { forwardRef } from 'react';
import type { FC, RefAttributes } from 'react';

import { Link as ChakraLink } from '@chakra-ui/react';

type Pretty<T> = { [K in keyof T]: T[K] } & object;
type Merge<P, T> = Pretty<Omit<P, keyof T> & T>;
type LegacyProps = 'as' | 'legacyBehavior' | 'passHref';

type NextLinkComponent = FC<RefAttributes<HTMLAnchorElement> & NextLinkProps>;

export type NextLinkProps = Merge<
  ChakraLinkProps,
  Omit<LinkProps, LegacyProps>
>;

const NextLink: NextLinkComponent = forwardRef(function NextLink(props, ref) {
  const { href, target: _target, children, ...rest } = props;

  // const isInternal =
  //   href &&
  //   (href.toString().startsWith('/') || href.toString().startsWith('#'));

  return (
    <ChakraLink
      ref={ref}
      as={Link}
      href={href as string}
      target={_target || '_self'}
      {...rest}
    >
      {children}
    </ChakraLink>
  );
});

export default NextLink;
