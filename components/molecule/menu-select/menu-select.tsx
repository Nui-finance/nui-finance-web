import { Button, ButtonProps } from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  chakra,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { MenuSelectOptionType, MenuSelectProps } from './menu-select.types';
import { Check, ArrowDown } from '../icons';

const MenuSelect = ({
  defaultValue,
  options = [],
  onChange,
  value,
  renderOption,
  renderButtonText,
  renderButtonIcon,
  menuButtonProps,
  menuListProps,
  menuOptionGroupProps,
  menuItemOptionProps,
  menuDrawerEnabled = false,
  renderDrawerHeader,
  menuItemOptionIconProps,
  ...restProps
}: MenuSelectProps<MenuSelectOptionType>) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const getButtonProps = (isOpen: boolean): ButtonProps =>
    typeof renderButtonIcon === 'function'
      ? { ...menuButtonProps, rightIcon: renderButtonIcon(isOpen) }
      : { ...menuButtonProps };

  const _renderOption = (
    option: MenuSelectOptionType,
    isSelected?: boolean,
  ) => {
    if (typeof renderOption === 'function') {
      return renderOption(option, isSelected || option.value === value?.value);
    }

    return option.label ?? option.value;
  };

  const _renderButtonText = (option: MenuSelectOptionType) => {
    if (typeof renderButtonText === 'function') {
      return renderButtonText(option, true);
    }

    return _renderOption(option, true);
  };

  return (
    <>
      {/* mobile menu button & drawer */}
      {menuDrawerEnabled && (
        <>
          <Button
            onClick={onOpen}
            rightIcon={<ArrowDown />}
            justifyContent="space-between"
            display={{
              base: menuDrawerEnabled ? 'inline-flex' : 'none',
              md: 'none',
            }}
            {...menuButtonProps}
          >
            {_renderButtonText(value)}
          </Button>
          <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay backdropFilter="blur(0px)" />
            <DrawerContent
              borderTop="1px solid"
              // borderColor="border.primary"
              borderTopRightRadius="md"
              borderTopLeftRadius="md"
            >
              <DrawerCloseButton
                right="2"
                top={typeof renderDrawerHeader === 'function' ? '4' : '2'}
              />
              <DrawerHeader px="4">{renderDrawerHeader?.()}</DrawerHeader>
              <DrawerBody maxH="100dvh" px="0" pt="0" pb="4">
                <VStack spacing="0">
                  {options.map((option) => (
                    <chakra.div
                      as={Button}
                      key={option.value.toString()}
                      variant="ghost"
                      px="4"
                      justifyContent="space-between"
                      borderRadius="none"
                      alignSelf="stretch"
                      isActive={option.value === value?.value}
                      rightIcon={
                        option.value === value?.value ? (
                          <Check boxSize="1.25rem" />
                        ) : undefined
                      }
                      onClick={() => {
                        onChange(option);
                        onClose();
                      }}
                      {...menuItemOptionProps}
                    >
                      {_renderOption(option)}
                    </chakra.div>
                  ))}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}

      {/* desktop menu */}
      <Menu {...restProps}>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              textAlign="left"
              // colorScheme="mono"
              display={{
                base: menuDrawerEnabled ? 'none' : 'inline-flex',
                md: 'inline-flex',
              }}
              {...getButtonProps(isOpen)}
            >
              {_renderButtonText(value)}
            </MenuButton>
            <MenuList
              display={{
                base: menuDrawerEnabled ? 'none' : 'block',
                md: 'block',
              }}
              {...menuListProps}
            >
              <MenuOptionGroup
                defaultValue={defaultValue}
                type="radio"
                onChange={(value) => {
                  const selectedOption = options.find(
                    (option) => option.value.toString() === value,
                  );
                  onChange(selectedOption);
                }}
                value={value.value.toString()}
                {...menuOptionGroupProps}
              >
                {options.map((option) => {
                  return (
                    <MenuItemOption
                      key={option.value.toString()}
                      value={option.value.toString()}
                      icon={
                        <Check boxSize="1.25rem" {...menuItemOptionIconProps} />
                      }
                      flexDirection="row-reverse"
                      sx={{
                        '& > .chakra-menu__icon-wrapper': {
                          marginRight: 0,
                          marginLeft: 2,
                        },
                      }}
                      {...menuItemOptionProps}
                    >
                      {_renderOption(option)}
                    </MenuItemOption>
                  );
                })}
              </MenuOptionGroup>
            </MenuList>
          </>
        )}
      </Menu>
    </>
  );
};

export default MenuSelect;
