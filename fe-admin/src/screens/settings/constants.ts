export type SettingTabId = "BANK" | "SHIPPING" | "LOYALTY" | "TELEGRAM";

export type BankOption = {
  name: string;
  bin: string;
  shortName: string;
};

export const POPULAR_BANKS: BankOption[] = [
  { name: "Ngân hàng Quân Đội", bin: "970422", shortName: "MB Bank" },
  { name: "Ngân hàng Ngoại Thương Việt Nam", bin: "970436", shortName: "Vietcombank" },
  { name: "Ngân hàng Công Thương Việt Nam", bin: "970415", shortName: "VietinBank" },
  { name: "Ngân hàng Kỹ Thương Việt Nam", bin: "970407", shortName: "Techcombank" },
  { name: "Ngân hàng Á Châu", bin: "970416", shortName: "ACB" },
  { name: "Ngân hàng Việt Nam Thịnh Vượng", bin: "970432", shortName: "VPBank" },
  { name: "Ngân hàng Tiên Phong", bin: "970423", shortName: "TPBank" },
  { name: "Ngân hàng Đầu tư và Phát triển Việt Nam", bin: "970418", shortName: "BIDV" },
  { name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam", bin: "970405", shortName: "Agribank" },
  { name: "Ngân hàng Sài Gòn Thương Tín", bin: "970403", shortName: "Sacombank" },
  { name: "Ngân hàng Quốc Dân", bin: "970419", shortName: "NCB" },
  { name: "Ngân hàng Hàng Hải Việt Nam", bin: "970426", shortName: "MSB" },
];

export const QR_TEMPLATE_OPTIONS = [
  { value: "compact2", label: "Compact 2 (Gọn nhẹ + Logo Ngân hàng)" },
  { value: "compact", label: "Compact 1 (Mặc định)" },
  { value: "qr_only", label: "QR Only (Chỉ hình mã QR)" },
  { value: "print", label: "Print (Thích hợp in ấn)" },
];

export type SystemSettingsState = {
  bankName: string;
  bankBin: string;
  bankAccountNo: string;
  bankAccountName: string;
  qrTemplate: string;

  orderHoldMinutes: number;
  shippingFee: number;
  freeShippingThreshold: number;
  enableFreeShipping: boolean;

  loyaltyEarnRate: number;
  loyaltyRedeemRate: number;
  loyaltyRedeemValue: number;
  minOrderValueForRedeem: number;

  telegramBotToken: string;
  telegramChatId: string;
  notifyNewOrderTelegram: boolean;
  notifyPaidTelegram: boolean;
  enableSoundNotification: boolean;
};

export const DEFAULT_SETTINGS_STATE: SystemSettingsState = {
  bankName: "MB Bank",
  bankBin: "970422",
  bankAccountNo: "0381000123456",
  bankAccountName: "TIEM LEN NHA KIEU",
  qrTemplate: "compact2",

  orderHoldMinutes: 15,
  shippingFee: 25000,
  freeShippingThreshold: 300000,
  enableFreeShipping: true,

  loyaltyEarnRate: 1000,
  loyaltyRedeemRate: 100,
  loyaltyRedeemValue: 10000,
  minOrderValueForRedeem: 100000,

  telegramBotToken: "",
  telegramChatId: "",
  notifyNewOrderTelegram: true,
  notifyPaidTelegram: true,
  enableSoundNotification: true,
};
