import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import StorageIcon from "@mui/icons-material/Storage";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderIcon from "@mui/icons-material/Folder";
import DatasetIcon from "@mui/icons-material/Dataset";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentIcon from "@mui/icons-material/Payment";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { SvgIconComponent } from "@mui/icons-material";

export type SideBarItemType<T> = {
  name: string;
  icon?: SvgIconComponent;
  link?: string;
  items?: SideBarItemType<T>[];
};

export const sidebarItems: SideBarItemType<any>[] = [
  {
    name: "Profile",
    icon: AccountCircleIcon,
    link: "/dashboard/profile",
  },
  {
    name: "Settings",
    icon: SettingsIcon,
    link: "/dashboard/settings",
  },
  {
    name: "Packages",
    icon: StorageIcon,
    link: "/dashboard/",
  },
  {
    name: "Notifications",
    icon: NotificationsIcon,
    link: "/dashboard/notifications",
  },
  {
    name: "Payments",
    icon: PaymentIcon,
    link: "/dashboard/payments",
  },
  {
    name: "Feedback",
    icon: RateReviewIcon,
    link: "/dashboard/feedback",
  },
  // {
  //   name: "Data",
  //   icon: StorageIcon,
  //   link: "/dashboard/data",
  //   items: [
  //     {
  //       name: "Upload Data",
  //       icon: UploadFileIcon,
  //       link: "/dashboard/data/upload",
  //     },
  //     {
  //       name: "My Files",
  //       icon: FolderIcon,
  //       link: "/dashboard/data/my-data",
  //     },
  //     {
  //       name: "All Records",
  //       icon: DatasetIcon,
  //       link: "/dashboard/admin/data/all-records",
  //     },
  //   ],
  // },
  {
    name: "Help desk",
    icon: HelpOutlineIcon,
    link: "/dashboard/help",
  },
];
