"use client"
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import InputIcon from '@mui/icons-material/Input';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GavelIcon from '@mui/icons-material/Gavel';
import SettingsIcon from '@mui/icons-material/Settings';
import type { SidebarItem } from '@/components/sidebar/sidebarTypes';

const payrollSideBarItems: SidebarItem[] = [
  {
    key: 'overview',
    icon: <DashboardIcon fontSize="small" />,
    label: 'Overview',
    href: '/hr/payroll',
  },
  {
    key: 'payslips',
    icon: <ReceiptLongIcon fontSize="small" />,
    label: 'Payslips',
    href: '/hr/payroll/payslips',
  },
  {
    key: 'payroll-batches',
    icon: <BatchPredictionIcon fontSize="small" />,
    label: 'Payroll Batches',
    href: '/hr/payroll/payroll-batches',
  },
  {
    key: 'payslip-inputs',
    icon: <InputIcon fontSize="small" />,
    label: 'Payslip Inputs',
    href: '/hr/payroll/payslip-inputs',
  },
  {
    key: 'bank-accounts',
    icon: <AccountBalanceIcon fontSize="small" />,
    label: 'Bank Accounts',
    href: '/hr/payroll/bank-accounts',
  },
  {
    key: 'work-entries',
    icon: <WorkHistoryIcon fontSize="small" />,
    label: 'Work Entries',
    href: '/hr/payroll/work-entries',
  },
  {
    key: 'tax-bracket',
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    label: 'Tax Bracket',
    href: '/hr/payroll/tax-bracket',
  },
  {
    key: 'pension-policy',
    icon: <GavelIcon fontSize="small" />,
    label: 'Pension Policy',
    href: '/hr/payroll/pension-policy',
  },
  {
    key: 'configuration',
    icon: <SettingsIcon fontSize="small" />,
    label: 'Configuration',
    href: '/hr/payroll/settings',
  },
];

export const PayrollBottomItems: SidebarItem[] = [
  { key: 'settings', icon: <SettingsIcon />, label: 'Settings', href: '/hr/payroll/settings' },
];

export default payrollSideBarItems; 
