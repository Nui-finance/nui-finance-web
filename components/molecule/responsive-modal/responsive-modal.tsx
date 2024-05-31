import {
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  Children,
  cloneElement,
  createContext,
  createElement,
  isValidElement,
} from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import {
  ResponsiveBodyProps,
  ResponsiveFooterProps,
  ResponsiveHeaderProps,
  ResponsiveModalProps,
  ResponsiveModalStepProps,
  ResponsiveRootProps,
} from './responsive-modal.types';

const initialValue = {
  isMobile: false,
  activeStep: 0,
};

export const ResponsiveModalContext = createContext(initialValue);

const ResponsiveRoot = ({
  isMobile,
  isOpen,
  onClose,
  children,
  size,
  isCloseable,
  type,
  ...restProps
}: ResponsiveRootProps) => {
  const renderType = type === 'auto' ? (isMobile && 'drawer') || 'modal' : type;

  if (renderType === 'drawer') {
    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        closeOnEsc={isCloseable}
        closeOnOverlayClick={isCloseable}
        {...restProps}
      >
        <DrawerOverlay />
        <DrawerContent
          borderTopRightRadius="md"
          borderTopLeftRadius="md"
          boxShadow="0px 12px 30px rgba(20, 16, 20, 0.85)"
          backdropBlur="10px"
          overflowY="auto"
          maxH="100dvh"
        >
          <DrawerCloseButton right="2" isDisabled={!isCloseable} />
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      closeOnEsc={isCloseable}
      closeOnOverlayClick={isCloseable}
      {...restProps}
    >
      <ModalOverlay />
      <ModalContent backdropBlur="10px" mx="8">
        <ModalCloseButton right="2" isDisabled={!isCloseable} />
        {children}
      </ModalContent>
    </Modal>
  );
};

const ResponsiveHeader = ({ isMobile, ...restProps }: ResponsiveHeaderProps) =>
  createElement(isMobile ? DrawerHeader : ModalHeader, restProps);

const ResponsiveBody = ({ isMobile, ...restProps }: ResponsiveBodyProps) =>
  createElement(isMobile ? DrawerBody : ModalBody, restProps);

const ResponsiveFooter = ({ isMobile, ...restProps }: ResponsiveFooterProps) =>
  createElement(isMobile ? DrawerFooter : ModalFooter, restProps);

export const ResponsiveModal = ({
  children,
  isOpen,
  onClose,
  activeStep,
  isResponsive = true,
  isCloseable = true,
  size = 'xl',
  type = 'auto',
}: ResponsiveModalProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48em)', {
    ssr: true,
    fallback: false,
  });

  return (
    <ResponsiveModalContext.Provider
      value={{ isMobile: isResponsive && isMobile, activeStep: 0 }}
    >
      <ResponsiveRoot
        isOpen={isOpen}
        onClose={onClose}
        isMobile={isMobile}
        type={type}
        size={size}
        isCloseable={isCloseable}
      >
        {Children.map(children, (child, index) => {
          const stepProps = {
            isActive: index === activeStep,
          };

          if (isValidElement(child)) {
            return cloneElement(child, stepProps);
          }
          return null;
        })}
      </ResponsiveRoot>
    </ResponsiveModalContext.Provider>
  );
};

export const ResponsiveModalStep = ({
  isActive,
  children,
}: ResponsiveModalStepProps) => (isActive ? children : null);

export const ResponsiveModalHeader = (props: ModalHeaderProps) => {
  return (
    <ResponsiveModalContext.Consumer>
      {({ isMobile }) => <ResponsiveHeader isMobile={isMobile} {...props} />}
    </ResponsiveModalContext.Consumer>
  );
};

export const ResponsiveModalBody = (props: ModalBodyProps) => {
  return (
    <ResponsiveModalContext.Consumer>
      {({ isMobile }) => <ResponsiveBody isMobile={isMobile} {...props} />}
    </ResponsiveModalContext.Consumer>
  );
};

export const ResponsiveModalFooter = (props: ModalFooterProps) => {
  return (
    <ResponsiveModalContext.Consumer>
      {({ isMobile }) => <ResponsiveFooter isMobile={isMobile} {...props} />}
    </ResponsiveModalContext.Consumer>
  );
};
