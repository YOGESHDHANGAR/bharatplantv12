import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import LoyaltyIcon from "@mui/icons-material/LoyaltyOutlined";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import AssessmentIcon from "@mui/icons-material/AssessmentOutlined";
import AccountBalanceTwoToneIcon from "@mui/icons-material/AccountBalanceTwoTone";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EngineeringIcon from "@mui/icons-material/Engineering";

export const linkData = [
  {
    linkText: "Dashboard",
    linkUrl: "/",
    icon: <DashboardIcon />,
    key: "dashboard",
  },
  {
    linkText: "Sales",
    linkUrl: "/sale",
    icon: <LoyaltyIcon />,
    key: "sale",
  },
  {
    linkText: "Purchase",
    linkUrl: "/purchase",
    icon: <ShoppingCartIcon />,
    key: "purchase",
  },

  {
    linkText: "Receipt",
    linkUrl: "/receipt",
    icon: <ReceiptIcon />,
    key: "receipt",
  },
  {
    linkText: "Payment",
    linkUrl: "/payment",
    icon: <PaymentsIcon />,
    key: "payment",
  },
  {
    linkText: "Master",
    linkUrl: "/master",
    icon: <AccountTreeIcon />,
    key: "master",
  },
  {
    linkText: "Ledger Statement",
    linkUrl: "/ledgerStatement",
    icon: <ImportContactsOutlinedIcon />,
    key: "ledgerStatement",
  },
  {
    linkText: "Salary",
    linkUrl: "/salary",
    icon: <EngineeringIcon />,
    key: "salary",
  },
  {
    linkText: "Expense",
    linkUrl: "/expense",
    icon: <AccountBalanceWalletIcon />,
    key: "expense",
  },
  {
    linkText: "BankStatement",
    linkUrl: "/bankStatement",
    icon: <AccountBalanceTwoToneIcon />,
    key: "bankStatement",
  },
  {
    linkText: "Reports",
    linkUrl: "/reports",
    icon: <AssessmentIcon />,
    key: "reports",
  },
  {
    linkText: "Voucher Template",
    linkUrl: "/voucherTemplate",
    icon: <ReceiptLongOutlinedIcon />,
    key: "voucherTemplate",
  },
  {
    linkText: "File System",
    linkUrl: "/fileSystem",
    icon: <FolderOpenOutlinedIcon />,
    key: "fileSystem",
  },
  {
    linkText: "Recycle Bin",
    linkUrl: "/recycleBin",
    icon: <DeleteOutlineIcon />,
    key: "recycleBin",
  },
];
