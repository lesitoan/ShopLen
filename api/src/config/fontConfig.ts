import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const FONT_CONFIG = {
  // Tên font family dùng trong các bộ sinh ảnh/PDF
  family: process.env.FONT_FAMILY || "Be Vietnam Pro",

  // Đường dẫn đến tệp ttf lưu trữ local trong project (dùng khi export PDF, Canvas, v.v.)
  regularPath: path.join(__dirname, "../../assets/fonts/BeVietnamPro-Regular.ttf"),
  boldPath: path.join(__dirname, "../../assets/fonts/BeVietnamPro-Bold.ttf"),
  mediumPath: path.join(__dirname, "../../assets/fonts/BeVietnamPro-Medium.ttf"),
};
