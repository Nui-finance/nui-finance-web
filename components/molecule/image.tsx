import { AspectRatio } from '@chakra-ui/react';
import { useSize } from '@chakra-ui/react-use-size';
import NextImage, {
  ImageLoaderProps,
  ImageProps as NextImageProps,
} from 'next/image';
import React from 'react';
import { useRef } from 'react';

type LoaderProps = ImageLoaderProps & {
  crop?: boolean;
  containerWidth: number;
  containerHeight: number;
  params: { [key: string]: string };
};

type ImageProps = NextImageProps & {
  crop?: boolean;
  ratio?: number;
  // loader: (props: LoaderProps) => string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  borderRadius?: string;
  params?: { [key: string]: string };
};

const Image = ({
  src,
  alt = '',
  ratio = 1,
  style,
  sizes,
  crop = false,
  // loader,
  objectFit = 'contain',
  borderRadius = '1rem',
  params,
  ...props
}: ImageProps) => {
  const wrapperRef = useRef(null);
  const wrapperSize = useSize(wrapperRef);

  if (!src) {
    return null;
  }

  return (
    <AspectRatio
      ref={wrapperRef}
      ratio={ratio}
      position="relative"
      overflow="hidden"
      borderRadius={borderRadius}
    >
      {(wrapperSize?.width && wrapperSize?.height && (
        <NextImage
          src={src}
          alt={alt}
          style={{ objectFit, ...style }}
          sizes={sizes || `${Math.floor(wrapperSize?.width)}px`}
          // loader={(nextImageLoaderProps) =>
          //   loader({
          //     ...nextImageLoaderProps,
          //     crop,
          //     containerWidth: wrapperSize.width,
          //     containerHeight: wrapperSize.height,
          //     params,
          //   })
          // }
          {...props}
        />
      )) || <div />}
    </AspectRatio>
  );
};

export default Image;
