import {
  DrawerProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
} from '@chakra-ui/react';

export * from './responsive-modal';

export type ResponsiveModalProps = ResponsiveRootProps & {
  activeStep?: number;
  isResponsive?: boolean;
  isCloseable?: boolean;
  type?: string;
};

export type ResponsiveModalStepProps = {
  isActive?: boolean;
  children: JSX.Element;
};

export type ResponsiveModalHeaderProps = ModalProps & DrawerProps;

export type ResponsiveRootProps = ResponsiveModalHeaderProps & {
  isMobile?: boolean;
  isCloseable?: boolean;
  type?: string;
};

export type ResponsiveHeaderProps = ModalHeaderProps & {
  isMobile: boolean;
};

export type ResponsiveBodyProps = ModalBodyProps & {
  isMobile: boolean;
};

export type ResponsiveFooterProps = ModalFooterProps & {
  isMobile: boolean;
};
