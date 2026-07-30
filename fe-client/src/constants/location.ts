export const PROVINCE_OPTIONS = [
  { value: "TUYEN_QUANG", label: "Tuyên Quang" },
  { value: "LAO_CAI", label: "Lào Cai" },
  { value: "LAI_CHAU", label: "Lai Châu" },
  { value: "DIEN_BIEN", label: "Điện Biên" },
  { value: "LANG_SON", label: "Lạng Sơn" },
  { value: "CAO_BANG", label: "Cao Bằng" },
  { value: "SON_LA", label: "Sơn La" },
  { value: "THAI_NGUYEN", label: "Thái Nguyên" },
  { value: "PHU_THO", label: "Phú Thọ" },
  { value: "QUANG_NINH", label: "Quảng Ninh" },
  { value: "BAC_NINH", label: "Bắc Ninh" },
  { value: "HUNG_YEN", label: "Hưng Yên" },
  { value: "HA_NOI", label: "TP. Hà Nội" },
  { value: "HAI_PHONG", label: "TP. Hải Phòng" },
  { value: "NINH_BINH", label: "Ninh Bình" },
  { value: "THANH_HOA", label: "Thanh Hóa" },
  { value: "NGHE_AN", label: "Nghệ An" },
  { value: "HA_TINH", label: "Hà Tĩnh" },
  { value: "QUANG_TRI", label: "Quảng Trị" },
  { value: "HUE", label: "TP. Huế" },
  { value: "DA_NANG", label: "TP. Đà Nẵng" },
  { value: "QUANG_NGAI", label: "Quảng Ngãi" },
  { value: "GIA_LAI", label: "Gia Lai" },
  { value: "KHANH_HOA", label: "Khánh Hoà" },
  { value: "LAM_DONG", label: "Lâm Đồng" },
  { value: "DAK_LAK", label: "Đắk Lắk" },
  { value: "HO_CHI_MINH", label: "TP. Hồ Chí Minh" },
  { value: "DONG_NAI", label: "Đồng Nai" },
  { value: "TAY_NINH", label: "Tây Ninh" },
  { value: "CAN_THO", label: "TP. Cần Thơ" },
  { value: "VINH_LONG", label: "Vĩnh Long" },
  { value: "DONG_THAP", label: "Đồng Tháp" },
  { value: "CA_MAU", label: "Cà Mau" },
  { value: "AN_GIANG", label: "An Giang" },
];

export const PROVINCE_NAME_MAP: Record<string, string> = Object.fromEntries(
  PROVINCE_OPTIONS.map((opt) => [opt.value, opt.label])
);

export function getProvinceName(raw: string | undefined | null): string {
  if (!raw) return "";
  if (PROVINCE_NAME_MAP[raw]) return PROVINCE_NAME_MAP[raw];
  const withoutIndex = raw.replace(/^\d+\.\s*/, "");
  const found = PROVINCE_OPTIONS.find(
    (opt) => opt.label.toLowerCase() === withoutIndex.toLowerCase()
  );
  return found ? found.label : withoutIndex;
}

