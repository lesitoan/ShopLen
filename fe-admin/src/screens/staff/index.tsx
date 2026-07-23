"use client";

import React, { useState, useMemo } from "react";

import { Modal } from "@/components/ui/Modal";
import {
  MOCK_STAFF_DATA,
  StaffListItem,
  StaffFilterState,
} from "./constants";
import { StaffHeader } from "./components/StaffHeader";
import { StaffFilterBar } from "./components/StaffFilterBar";
import { StaffTable } from "./components/StaffTable";
import { StaffDrawerForm } from "./components/StaffDrawerForm";
import { PermissionMatrixModal } from "./components/PermissionMatrixModal";

export function StaffListScreen() {
  const [staffList, setStaffList] = useState<StaffListItem[]>(MOCK_STAFF_DATA);

  const [filters, setFilters] = useState<StaffFilterState>({
    searchQuery: "",
    roleFilter: "ALL",
    statusFilter: "ALL",
    page: 1,
    pageSize: 10,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffListItem | null>(null);

  const [isPermissionMatrixOpen, setIsPermissionMatrixOpen] = useState(false);

  const [deletingStaff, setDeletingStaff] = useState<StaffListItem | null>(null);
  const [togglingStaff, setTogglingStaff] = useState<StaffListItem | null>(null);

  const handleFilterChange = (newFilters: Partial<StaffFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter((item) => {
      const matchesSearch =
        !filters.searchQuery ||
        item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.phone.includes(filters.searchQuery);

      const matchesRole =
        filters.roleFilter === "ALL" || item.role === filters.roleFilter;

      const matchesStatus =
        filters.statusFilter === "ALL" || item.status === filters.statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffList, filters]);

  const handleOpenCreateDrawer = () => {
    setEditingStaff(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (staff: StaffListItem) => {
    setEditingStaff(staff);
    setIsDrawerOpen(true);
  };

  const handleSaveStaff = (staffData: Partial<StaffListItem>) => {
    if (editingStaff) {
      setStaffList((prev) =>
        prev.map((item) =>
          item.id === editingStaff.id
            ? { ...item, ...staffData }
            : item
        )
      );
    } else {
      const newStaff: StaffListItem = {
        id: `staff_${Date.now()}`,
        code: `NV-00${staffList.length + 1}`,
        name: staffData.name || "",
        email: staffData.email || "",
        phone: staffData.phone || "",
        role: staffData.role || "STAFF_ORDER",
        roleName: staffData.roleName || "CTV check đơn",
        status: staffData.status || "ACTIVE",
        avatar: staffData.avatar,
        lastLoginAt: "Chưa đăng nhập",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setStaffList((prev) => [newStaff, ...prev]);
    }
    setIsDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingStaff) return;
    setStaffList((prev) => prev.filter((item) => item.id !== deletingStaff.id));
    setDeletingStaff(null);
  };

  const handleConfirmToggleStatus = () => {
    if (!togglingStaff) return;
    setStaffList((prev) =>
      prev.map((item) =>
        item.id === togglingStaff.id
          ? { ...item, status: item.status === "ACTIVE" ? "LOCKED" : "ACTIVE" }
          : item
      )
    );
    setTogglingStaff(null);
  };

  return (
    <div className="space-y-6">
      <StaffHeader
        onOpenPermissionMatrix={() => setIsPermissionMatrixOpen(true)}
        onAddStaff={handleOpenCreateDrawer}
      />

      <StaffFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <StaffTable
        data={filteredStaff}
        onEdit={handleOpenEditDrawer}
        onDelete={(staff) => setDeletingStaff(staff)}
        onToggleStatus={(id) => {
          const target = staffList.find((s) => s.id === id);
          if (target) setTogglingStaff(target);
        }}
        onViewPermissions={() => setIsPermissionMatrixOpen(true)}
      />

      <StaffDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSaveStaff}
        editingStaff={editingStaff}
      />

      <PermissionMatrixModal
        isOpen={isPermissionMatrixOpen}
        onClose={() => setIsPermissionMatrixOpen(false)}
      />

      <Modal
        isOpen={!!deletingStaff}
        onClose={() => setDeletingStaff(null)}
        onConfirm={handleConfirmDelete}
        type="DANGER"
        title="Xóa tài khoản nhân viên"
        description={`Bạn có chắc chắn muốn xóa tài khoản nhân viên "${deletingStaff?.name}" (${deletingStaff?.code}) không? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa nhân viên"
        cancelText="Bỏ qua"
        size="sm"
      />

      <Modal
        isOpen={!!togglingStaff}
        onClose={() => setTogglingStaff(null)}
        onConfirm={handleConfirmToggleStatus}
        type={togglingStaff?.status === "ACTIVE" ? "DANGER" : "CONFIRM"}
        title={
          togglingStaff?.status === "ACTIVE"
            ? "Tạm khóa tài khoản nhân viên"
            : "Mở khóa tài khoản nhân viên"
        }
        description={
          togglingStaff?.status === "ACTIVE"
            ? `Bạn có chắc chắn muốn tạm khóa tài khoản của nhân viên "${togglingStaff?.name}" không? Nhân viên sẽ bị ngắt phiên đăng nhập.`
            : `Mở khóa tài khoản cho nhân viên "${togglingStaff?.name}" truy cập hệ thống?`
        }
        confirmText={
          togglingStaff?.status === "ACTIVE" ? "Tạm khóa" : "Mở khóa"
        }
        cancelText="Bỏ qua"
        size="sm"
      />
    </div>
  );
}
