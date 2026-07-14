"use client";

import React, { useState } from "react";
import {
  Heart,
  Share2,
  HelpCircle,
  ShoppingBag,
  Trash2,
  Plus,
  Compass,
  AlertTriangle,
} from "lucide-react";

// Import custom UI components
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Badge from "@/components/ui/badge";
import Checkbox from "@/components/ui/checkbox";
import Radio from "@/components/ui/radio";
import Switch from "@/components/ui/switch";
import Alert from "@/components/ui/alert";
import ProductCard from "@/components/ui/productCard";
import Select from "@/components/ui/select";
import Toast, { ToastType } from "@/components/ui/toast";
import Tooltip from "@/components/ui/tooltip";
import Tabs from "@/components/ui/tabs";
import Pagination from "@/components/ui/pagination";
import Breadcrumb from "@/components/ui/breadcrumb";
import EmptyState from "@/components/ui/emptyState";
import UploadFile from "@/components/ui/uploadFile";
import Modal from "@/components/ui/modal";

export default function UiDemoScreen() {
  // States for interactive components
  const [selectVal, setSelectVal] = useState("");
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [radioVal, setRadioVal] = useState("option1");
  const [switchVal, setSwitchVal] = useState(true);

  // Tabs state
  const [activeTab, setActiveTab] = useState("desc");
  const demoTabs = [
    { id: "desc", label: "Mô tả sản phẩm" },
    { id: "reviews", label: "Đánh giá", badge: 128 },
    { id: "guide", label: "Hướng dẫn" },
    { id: "policy", label: "Chính sách" },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic toast state
  const [toasts, setToasts] = useState<{ id: string; type: ToastType; message: string }[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-16 relative">
      {/* Dynamic Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            type={t.type}
            message={t.message}
            onClose={() => removeToast(t.id)}
            onUndo={t.type === "undo" ? () => alert("Đã hoàn tác hành động!") : undefined}
          />
        ))}
      </div>

      {/* Header Banner */}
      <div className="bg-white border-b border-border py-8 px-6 mb-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold bg-primary-light text-secondary px-2.5 py-0.5 rounded-full">
                Design System Catalog
              </span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary">Giao Diện Hệ Thống UI Component</h1>
            <p className="text-[14px] text-text-secondary mt-1">
              Thư viện hiển thị toàn bộ các thành phần giao diện chuẩn của dự án Tiệm Len Nhà Kiều.
            </p>
          </div>
          <a href="/">
            <Button variant="secondary" className="rounded-full border-border">
              Về Trang Chủ
            </Button>
          </a>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-10">
        
        {/* Section 1: Colors & Typography */}
        <section className="bg-white p-6 border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-border">
            1. Hệ Màu sắc & Phông chữ (Colors & Typography)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Color Swatches */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4">Màu Sắc Thương Hiệu</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary border border-border" />
                  <div>
                    <p className="text-[13px] font-semibold">primary</p>
                    <p className="text-[11px] text-text-secondary">#F9B4C7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-hover border border-border" />
                  <div>
                    <p className="text-[13px] font-semibold">primaryHover</p>
                    <p className="text-[11px] text-text-secondary">#F5A389</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-active border border-border" />
                  <div>
                    <p className="text-[13px] font-semibold">primaryActive</p>
                    <p className="text-[11px] text-text-secondary">#EE91AA</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-light border border-border" />
                  <div>
                    <p className="text-[13px] font-semibold">primaryLight</p>
                    <p className="text-[11px] text-text-secondary">#FFF1F4</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary border border-border" />
                  <div>
                    <p className="text-[13px] font-semibold">secondary</p>
                    <p className="text-[11px] text-text-secondary">#B85E66</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-text-primary border border-border" />
                  <div>
                    <p className="text-[13px] font-semibold">textPrimary</p>
                    <p className="text-[11px] text-text-secondary">#2D2D2D</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4">Kiểu Chữ chuẩn (Font: Be Vietnam Pro)</h3>
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <span className="w-20 text-[11px] text-text-secondary uppercase">H1 (32px)</span>
                  <span className="text-[32px] font-bold leading-tight truncate">Tiệm Len Nhà Kiều</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-20 text-[11px] text-text-secondary uppercase">H2 (24px)</span>
                  <span className="text-[24px] font-semibold leading-tight">Admin Dashboard</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-20 text-[11px] text-text-secondary uppercase">Body (14px)</span>
                  <span className="text-[14px]">Sản phẩm móc khóa len xinh xắn, quà sinh nhật.</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-20 text-[11px] text-text-secondary uppercase">Caption (11px)</span>
                  <span className="text-[11px] text-text-secondary">Đã đặt hàng lúc 12:40:50 - 12/07/2026</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Buttons */}
        <section className="bg-white p-6 border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-border">
            2. Nút bấm (Buttons)
          </h2>
          
          <div className="space-y-6">
            {/* Show Variants */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Các Biến Thể (Variants)</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
            </div>

            {/* Show States */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Các Trạng Thái (States) & Kích Thước (Sizes)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" disabled>Disabled State</Button>
                <Button variant="primary" size="sm">Small Size</Button>
                <Button variant="primary" size="md">Medium Size</Button>
                <Button variant="primary" size="lg">Large Size</Button>
                <Tooltip content="Yêu thích">
                  <Button variant="outline" size="md" iconOnly className="rounded-full">
                    <Heart size={16} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Form Controls */}
        <section className="bg-white p-6 border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-border">
            3. Bộ Điều Hướng Form (Inputs, Select & Custom Toggles)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Inputs & Select */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase">Input thường (Default / Filled)</label>
                <Input placeholder="Nhập tên của bạn..." defaultValue="Nguyễn Văn A" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase">Input lỗi (Error State)</label>
                <Input placeholder="Nhập email..." error="Email không hợp lệ" defaultValue="abc@xyz" />
                <p className="text-[11px] text-error mt-1">Vui lòng nhập đúng định dạng email.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase">Input tìm kiếm (Search Style)</label>
                <Input isSearch placeholder="Tìm sản phẩm, danh mục..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase">Select Dropdown</label>
                <Select
                  options={[
                    { value: "mokhoa", label: "Móc khóa len" },
                    { value: "thubong", label: "Thú bông len" },
                    { value: "hoalen", label: "Hoa len" },
                    { value: "phukien", label: "Phụ kiện" },
                    { value: "decor", label: "Đồ decor" },
                  ]}
                  value={selectVal}
                  onChange={(val) => setSelectVal(val)}
                  placeholder="Chọn danh mục sản phẩm"
                />
              </div>
            </div>

            {/* Right: Checkbox, Radio, Switch */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-3.5 uppercase">Hộp chọn (Checkbox)</label>
                <div className="flex flex-col gap-3">
                  <Checkbox
                    label="Đồng ý với điều khoản dịch vụ"
                    checked={checkboxVal}
                    onChange={(e) => setCheckboxVal(e.target.checked)}
                  />
                  <Checkbox label="Khóa đã kích hoạt sẵn" checked={true} readOnly />
                  <Checkbox label="Bị vô hiệu hóa (Disabled)" disabled />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-3.5 uppercase">Nút chọn một (Radio Button)</label>
                <div className="flex flex-col gap-3">
                  <Radio
                    label="Thanh toán ngân hàng QR"
                    name="demo-radio"
                    checked={radioVal === "option1"}
                    onChange={() => setRadioVal("option1")}
                  />
                  <Radio
                    label="Thanh toán khi nhận hàng (COD)"
                    name="demo-radio"
                    checked={radioVal === "option2"}
                    onChange={() => setRadioVal("option2")}
                  />
                  <Radio label="Lựa chọn bị vô hiệu hóa" name="demo-radio" disabled />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-3.5 uppercase">Công tắc chuyển (Switch)</label>
                <div className="flex flex-col gap-3">
                  <Switch
                    label="Nhận thông báo đơn hàng mới"
                    checked={switchVal}
                    onChange={(val) => setSwitchVal(val)}
                  />
                  <Switch label="Bị vô hiệu hóa (Disabled)" checked={false} onChange={() => {}} disabled />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Badges & Tags */}
        <section className="bg-white p-6 border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-border">
            4. Nhãn & Trạng thái (Badges & Tags)
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Nhãn Sản Phẩm (Product Badges)</h3>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="new">MỚI</Badge>
                <Badge variant="bestSeller">BÁN CHẠY</Badge>
                <Badge variant="hotTiktok">HOT TIKTOK</Badge>
                <Badge variant="sale">GIẢM 20%</Badge>
                <Badge variant="limited">GIỚI HẠN</Badge>
                <Badge variant="soldOut">HẾT HÀNG</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Trạng Thái Đơn Hàng (Order Badges)</h3>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="pending">Chờ xác nhận</Badge>
                <Badge variant="paid">Đã thanh toán</Badge>
                <Badge variant="processing">Đang xử lý</Badge>
                <Badge variant="shipping">Đang giao hàng</Badge>
                <Badge variant="completed">Đã hoàn thành</Badge>
                <Badge variant="cancelled">Đã hủy</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Static Toast & Alerts */}
        <section className="bg-white p-6 border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-border">
            5. Thông báo tĩnh & Hộp Alert (Toasts & Alerts)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dynamic Toast triggers */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Trigger Toast Notifications</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm" onClick={() => addToast("success", "Sản phẩm đã được thêm vào giỏ hàng!")}>
                  Success Toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => addToast("error", "Không thể hoàn thành giao dịch.")}>
                  Error Toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => addToast("warning", "Sắp hết hàng! Chỉ còn 2 sản phẩm.")}>
                  Warning Toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => addToast("info", "Thông tin đơn hàng đang cập nhật.")}>
                  Info Toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => addToast("loading", "Đang xử lý thanh toán...")}>
                  Loading Toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => addToast("undo", "Đã xóa sản phẩm khỏi giỏ hàng.")}>
                  Undo Toast
                </Button>
              </div>

              <h3 className="text-sm font-semibold text-text-primary mb-3">Xem trước Toast tĩnh</h3>
              <div className="space-y-3">
                <Toast type="success" message="Thành công! Thông tin cá nhân đã cập nhật." />
                <Toast type="undo" message="Đã xóa sản phẩm khỏi giỏ hàng." onUndo={() => {}} />
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Hộp Alert Tĩnh (Alert Banners)</h3>
              <Alert
                type="success"
                description="Thao tác của bạn đã được thực hiện thành công. Cảm ơn quý khách!"
              />
              <Alert
                type="warning"
                description="Hành động này có thể tốn phí giao hàng bổ sung nếu địa chỉ xa."
              />
              <Alert
                type="error"
                description="Đã xảy ra sự cố kết nối với cổng thanh toán ngân hàng."
              />
              <Alert
                type="info"
                description="Ưu đãi tích điểm 10% đang được kích hoạt cho mọi đơn hàng hôm nay."
              />
            </div>
          </div>
        </section>

        {/* Section 6: Tooltips, Tabs, Pagination & Breadcrumbs */}
        <section className="bg-white p-6 border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-border">
            6. Thành Phần Định Hướng (Tooltips, Tabs, Pagination & Breadcrumbs)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Tooltips */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Hộp giải thích (Tooltip)</h3>
                <div className="flex items-center gap-4">
                  <Tooltip content="Yêu thích móc khóa này" position="top">
                    <Button variant="outline" size="md" iconOnly className="rounded-full">
                      <Heart size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Chia sẻ bài viết" position="bottom">
                    <Button variant="outline" size="md" iconOnly className="rounded-full">
                      <Share2 size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Trợ giúp" position="right">
                    <Button variant="ghost" size="md" iconOnly>
                      <HelpCircle size={18} />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              {/* Breadcrumb */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Đường dẫn chỉ hướng (Breadcrumb)</h3>
                <Breadcrumb
                  items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Móc khóa len", href: "/san-pham" },
                    { label: "Bé Heo Hồng Dễ Thương" },
                  ]}
                />
              </div>

              {/* Pagination */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Phân trang (Pagination)</h3>
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>

            {/* Tabs */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Thanh chọn thẻ (Tabs)</h3>
              <Tabs tabs={demoTabs} activeTab={activeTab} onChange={(id) => setActiveTab(id)} />
              <div className="mt-4 p-4 border border-border rounded-xl bg-background text-[13px] text-text-secondary leading-relaxed min-h-[100px]">
                {activeTab === "desc" && (
                  <p>Móc khóa len handmade được làm từ 100% sợi len Milk Cotton mềm mại, đường đan đều đặn và chắc chắn, thích hợp để treo balo, chìa khóa xe hoặc làm quà tặng.</p>
                )}
                {activeTab === "reviews" && (
                  <p>Đánh giá từ khách hàng: 5/5 sao (128 lượt đánh giá). Toàn bộ sản phẩm đều nhận phản hồi hài lòng về chất lượng đóng gói và tính thẩm mỹ cao.</p>
                )}
                {activeTab === "guide" && (
                  <p>Hướng dẫn giặt sản phẩm: Giặt tay nhẹ bằng sữa tắm hoặc nước giặt nhẹ. Tránh vắt quá mạnh làm giãn dáng móc khóa len.</p>
                )}
                {activeTab === "policy" && (
                  <p>Chính sách bảo hành và đổi trả: Đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc đứt len sợi.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Card, Upload, Modal & Empty States */}
        <section className="bg-white p-6 border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-border">
            7. Thành Phần Nâng Cao (Product Card, Upload, Empty & Modal)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Card Showcase */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4">Sản Phẩm Card (Product Card)</h3>
              <div className="max-w-[280px]">
                <ProductCard
                  name="Móc khóa Bông Hoa Hướng Dương Len Nhỏ"
                  price={45000}
                  originalPrice={55000}
                  rating={4.8}
                  reviews={42}
                  image="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80"
                  badge="hotTiktok"
                  badgeLabel="🔥 HOT TIKTOK"
                  onAddToCart={() => addToast("success", "Đã thêm Bông Hoa Hướng Dương vào giỏ!")}
                />
              </div>
            </div>

            {/* Upload Area & Modal Trigger */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Tải tệp tin (Upload File Area)</h3>
                <UploadFile onFileSelect={(file) => addToast("info", `Đã chọn tệp: ${file.name}`)} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Hộp thoại bật lên (Confirm Modal)</h3>
                <Button variant="danger" size="md" onClick={() => setIsModalOpen(true)}>
                  Mở Modal Xác Nhận Xóa
                </Button>
                
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Xác nhận xóa sản phẩm"
                  description="Bạn có chắc chắn muốn xóa sản phẩm này ra khỏi giỏ hàng không? Hành động này sẽ cập nhật lại tổng hóa đơn của bạn."
                  isDestructive
                  confirmLabel="Xóa sản phẩm"
                  onConfirm={() => {
                    setIsModalOpen(false);
                    addToast("undo", "Đã xóa sản phẩm khỏi giỏ hàng.");
                  }}
                />
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="mt-10 pt-10 border-t border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-4 text-center">Trạng thái rỗng (Empty State)</h3>
            <EmptyState
              icon={<ShoppingBag size={48} />}
              title="Giỏ hàng của bạn đang trống"
              description="Hiện tại bạn chưa chọn mua bất kỳ móc khóa len nào. Hãy xem thử bộ sưu tập hoa len xinh xắn mới nhất nhé."
              actionLabel="Mua sắm ngay"
              onAction={() => alert("Chuyển hướng đến trang sản phẩm")}
            />
          </div>
        </section>

      </div>
    </div>
  );
}
