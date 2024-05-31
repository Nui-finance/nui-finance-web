import {
  ButtonProps,
  IconButtonProps,
  MenuItemOptionProps,
  MenuListProps,
  MenuOptionGroupProps,
  MenuProps,
  Placement,
} from '@chakra-ui/react';

export type MenuSelectProps<T> = {
  defaultValue?: string;
  options: T[];
  onChange: (arg1: any) => void;
  value: T;
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
  renderButtonText?: (option: T, isSelected: boolean) => React.ReactNode;
  renderButtonIcon?: (isSelected: boolean) => React.ReactElement;
  menuButtonProps?: ButtonProps | IconButtonProps;
  menuListProps?: MenuListProps;
  menuOptionGroupProps?: MenuOptionGroupProps;
  menuItemOptionProps?: MenuItemOptionProps;
  menuDrawerEnabled?: boolean;
  renderDrawerHeader?: () => React.ReactNode;
  placement?: Placement;
} & Omit<MenuProps, 'children' | 'placement'>;

export type MenuSelectOptionType = {
  value: any;
  label?: string;
};
