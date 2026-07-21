"use client";

import React, { useState } from "react";
import { MapPin, Plus, Check, Edit2, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { AddressItem } from "../types";

interface AddressTabProps {
  addresses: AddressItem[];
}

export default function AddressTab({ addresses: initialAddresses }: AddressTabProps) {
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newProvince, setNewProvince] = useState("TP. Hồ Chí Minh");

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newAddress) return;

    const newAddr: AddressItem = {
      id: "addr-" + Date.now(),
      fullName: newFullName,
      phone: newPhone,
      address: newAddress,
      province: newProvince,
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [...prev, newAddr]);
    setShowAddForm(false);
    setNewFullName("");
    setNewPhone("");
    setNewAddress("");
  };

  return (
    <div className="bg-transparent border-0 p-0 sm:bg-surface sm:border sm:border-border sm:rounded-xl sm:p-6 flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="hidden md:block">
          <h2 className="text-[18px] font-bold text-text-primary">
            Sổ địa chỉ
          </h2>
          <p className="text-[12.5px] text-text-secondary mt-1">
            Quản lý các địa chỉ nhận hàng của bạn để tự động điền khi thanh toán
          </p>
        </div>

        {!showAddForm && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto rounded-lg font-bold px-5 py-3 text-[13.5px] inline-flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={16} />
            <span>Thêm địa chỉ mới</span>
          </Button>
        )}
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddAddress}
          className="p-5 border border-primary/30 bg-primary-light/20 rounded-lg flex flex-col gap-4 animate-in fade-in duration-200"
        >
          <span className="text-[14px] font-bold text-text-primary">
            Thêm địa chỉ giao hàng mới
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Họ và tên người nhận *"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              className="w-full px-3.5 py-3 rounded-md border border-border bg-surface text-text-primary text-[13.5px] outline-none focus:border-primary"
              required
            />
            <input
              type="text"
              placeholder="Số điện thoại *"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full px-3.5 py-3 rounded-md border border-border bg-surface text-text-primary text-[13.5px] outline-none focus:border-primary"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Địa chỉ chi tiết (Tòa nhà, Số nhà, Đường, Phường/Xã, Quận/Huyện) *"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full px-3.5 py-3 rounded-md border border-border bg-surface text-text-primary text-[13.5px] outline-none focus:border-primary"
            required
          />

          <div className="grid grid-cols-2 sm:flex items-center justify-end gap-2.5 pt-2 w-full">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowAddForm(false)}
              className="w-full sm:w-auto rounded-lg text-[13px] py-2.5 px-4 justify-center"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto rounded-lg text-[13px] font-bold py-2.5 px-5 justify-center"
            >
              Lưu địa chỉ
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {addresses.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              item.isDefault
                ? "border-primary/40 bg-primary-light/10"
                : "border-border bg-background/30"
            }`}
          >
            <div className="flex flex-col gap-1.5 text-left flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-[14.5px] font-bold text-text-primary">
                    {item.fullName}
                  </span>
                  <span className="hidden sm:inline text-text-secondary text-[12.5px]">
                    • {item.phone}
                  </span>
                </div>
                {item.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-md bg-primary text-white text-[11px] font-bold shrink-0 whitespace-nowrap">
                    Mặc định
                  </span>
                )}
              </div>

              <span className="sm:hidden text-text-secondary text-[12.5px] font-medium">
                SĐT: {item.phone}
              </span>

              <p className="text-[13px] text-text-secondary flex items-start gap-1.5 mt-0.5">
                <MapPin size={15} className="shrink-0 text-secondary mt-0.5" />
                <span>
                  {item.address}, {item.province}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
              {!item.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(item.id)}
                  className="rounded-lg text-xs py-1.5"
                >
                  Thiết lập mặc định
                </Button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-text-secondary/60 hover:text-error rounded-lg hover:bg-background transition-colors"
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
