import { DashActionItems } from "../dash-actions";

export type NavbarItem = {
  label: string;
  link?: string;
  dropdown?: NavbarItem[];
};

export interface NavbarProps {
  items: NavbarItem[];
  leftItems?: NavbarItem[];
  title?: string;
  titleStyle?: React.CSSProperties;
  itemsPosition?:  'center' | 'right';
  showLogo?: boolean;
  showDashActions?: boolean;
  dashActions?: DashActionItems;
  height?: number;
}