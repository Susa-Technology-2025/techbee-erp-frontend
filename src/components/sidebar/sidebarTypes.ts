import type { ReactNode } from 'react';

export type SidebarItem = {
  key: string;
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  isView?: boolean;
  children?: SidebarItem[]; // Support for nested items
  href?: string; // Optional navigation path
}; 