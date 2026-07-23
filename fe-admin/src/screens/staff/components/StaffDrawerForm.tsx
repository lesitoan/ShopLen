"use client";

import React, { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { Switch } from "@/components/ui/Switch";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { StaffListItem, StaffRole, MOCK_ROLES } from "../constants";

interface StaffDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<StaffListItem>) => void;
  editingStaff?: StaffListItem | null;
}

export function StaffDrawerForm({
  isOpen,
  onClose,
  onSubmit,
  editingStaff,
}: StaffDrawerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("STAFF_ORDER");
  const [status, setStatus] = useState<"ACTIVE" | "LOCKED">("ACTIVE");
  const [avatarImages, setAvatarImages] = useState<string[]>([]);

  useEffect(() => {
    if (editingStaff) {
      setName(editingStaff.name);
      setEmail(editingStaff.email);
      setPhone(editingStaff.phone);
      setRole(editingStaff.role);
      setStatus(editingStaff.status);
      setAvatarImages(editingStaff.avatar ? [editingStaff.avatar] : []);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setRole("STAFF_ORDER");
      setStatus("ACTIVE");
      setAvatarImages([]);
    }
  }, [editingStaff, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const selectedRole = MOCK_ROLES.find((r) => r.key === role);

    onSubmit({
      id: editingStaff?.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      roleName: selectedRole ? selectedRole.name : "Nhân viên bán hàng",
      status,
      avatar: avatarImages.length > 0 ? avatarImages[0] : undefined,
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={editingStaff ? "Chỉnh sửa thông tin nhân viên" : "Thêm mới nhân viên"}
      description={
        editingStaff
          ? `Cập nhật thông tin và vai trò của nhân viên ${editingStaff.code}`
          : "Tạo tài khoản truy cập hệ thống quản trị cho nhân viên mới"
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Họ và tên nhân viên *"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập đầy đủ họ tên nhân viên..."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Địa chỉ Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@tiemlennhakieu.vn"
            required
          />

          <Input
            label="Số điện thoại *"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0901234567"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-text-secondary">
            Vai trò / Phân quyền *
          </label>
          <DropdownMenu
            variant="surface"
            label={MOCK_ROLES.find((r) => r.key === role)?.name ?? "Chọn vai trò"}
            selectedKey={role}
            items={MOCK_ROLES.map<DropdownMenuItem>((r) => ({ key: r.key, label: r.name }))}
            onSelect={(key) => setRole(key as StaffRole)}
            className="w-full"
          />
          <p className="text-[11px] text-text-muted">
            {MOCK_ROLES.find((r) => r.key === role)?.description}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Ảnh đại diện
          </h3>
          <ImageUploader
            label="Avatar nhân viên"
            values={avatarImages}
            onChange={(urls: string[]) => setAvatarImages(urls)}
            maxFiles={1}
          />
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-muted border border-border">
          <div>
            <div className="text-xs font-bold text-text-primary">Trạng thái tài khoản</div>
            <div className="text-[11px] text-text-muted"> Cho phép nhân viên đăng nhập vào hệ thống</div>
          </div>
          <Switch
            checked={status === "ACTIVE"}
            onChange={(checked) => setStatus(checked ? "ACTIVE" : "LOCKED")}
          />
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose} type="button">
            Hủy bỏ
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {editingStaff ? "Lưu thay đổi" : "Tạo tài khoản"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
