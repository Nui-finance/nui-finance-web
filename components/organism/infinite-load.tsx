import { ReactNode, isValidElement, useEffect, useRef, useState } from 'react';

import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Skeleton,
  Spinner,
  Text,
} from '@chakra-ui/react';

import { UseInfiniteQueryResult } from '@tanstack/react-query';

const LoadMoreButton = ({
  query,
  ...restProps
}: {
  query: UseInfiniteQueryResult;
} & ButtonProps) => {
  const { fetchNextPage, isFetchingNextPage, isError } = query;
  const loadMoreRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // infinite load implementation
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '800px',
      thereshold: 0.0,
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      setIsIntersecting(target.isIntersecting);
    }, options);

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loadMoreRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isIntersecting && !isFetchingNextPage && !isError) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting, isFetchingNextPage, isError]);

  return (
    <Button
      onClick={() => fetchNextPage()}
      isLoading={isFetchingNextPage}
      alignSelf="center"
      colorScheme="mono"
      size="lg"
      ref={loadMoreRef}
      display={isError ? 'none' : 'inline-flex'}
      mb="4"
      {...restProps}
    >
      Load More
    </Button>
  );
};

export type InfiniteLoadProps<T = any> = {
  children: ({ items }: { items: T[] }) => ReactNode;
  placeholder?: ReactNode;
  noResult?: ReactNode;
  buttonProps?: ButtonProps;
  query: UseInfiniteQueryResult & { items: T[] };
} & Omit<FlexProps, 'children' | 'placeholder'>;

const InfiniteLoad = ({
  children,
  query,
  placeholder,
  noResult,
  buttonProps,
  ...restProps
}: InfiniteLoadProps) => {
  const { items, hasNextPage, isLoading } = query;

  const renderPlaceholder = () => {
    return placeholder || <Spinner />;
  };

  const renderNoResult = () => {
    if (typeof noResult === 'string') {
      return <Text>{noResult}</Text>;
    }

    if (isValidElement(noResult)) {
      return noResult;
    }

    return 'No result found';
  };

  return (
    <Flex flexDirection="column" gap="4" alignItems="center" {...restProps}>
      {items?.length
        ? children({ items })
        : (isLoading && renderPlaceholder()) || renderNoResult()}

      {hasNextPage && <LoadMoreButton query={query} {...buttonProps} />}
    </Flex>
  );
};

export default InfiniteLoad;
