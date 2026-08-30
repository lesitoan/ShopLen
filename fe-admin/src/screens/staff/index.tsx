"use client";

import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Modal } from "@/components/ui/Modal";
import { useTableFilters } from "@/hooks/useTableFilters";
import {
  useListStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/services/api/staffApi";
import type {
  AdminUserItem,
  AdminUserListQueryDto,
} from "@/types/staff.type";
import { DEFAULT_STAFF_FILTERS } from "./constants";
import { StaffHeader } from "./components/StaffHeader";
import { StaffFilterBar } from "./components/StaffFilterBar";
import { StaffTable } from "./components/StaffTable";
import { StaffDrawerForm } from "./components/StaffDrawerForm";
import { PermissionMatrixModal } from "./components/PermissionMatrixModal";
import { UpdatePasswordModal } from "./components/UpdatePasswordModal";

export function StaffListScreen() {
  const { filters, setFilter, setFilters, resetFilters } = useTableFilters(
    DEFAULT_STAFF_FILTERS
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminUserItem | null>(null);
  const [isPermissionMatrixOpen, setIsPermissionMatrixOpen] = useState(false);

  const [deletingStaff, setDeletingStaff] = useState<AdminUserItem | null>(null);
  const [togglingStaff, setTogglingStaff] = useState<AdminUserItem | null>(null);
  const [passwordUpdatingStaff, setPasswordUpdatingStaff] =
    useState<AdminUserItem | null>(null);

  const queryDto: AdminUserListQueryDto = useMemo(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      search: (filters.search || "").trim() || undefined,
      role: filters.role === "ALL" ? undefined : filters.role,
      status: filters.status === "ALL" ? undefined : filters.status,
    };
  }, [filters]);

  const { data, isLoading, isFetching } = useListStaffQuery(queryDto);

  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const staffList = data?.items || [];
  const totalCount = data?.pagination.total || 0;

  const handleOpenCreateDrawer = () => {
    setEditingStaff(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (staff: AdminUserItem) => {
    setEditingStaff(staff);
    setIsDrawerOpen(true);
  };

  const handleSaveStaff = async (staffData: Partial<AdminUserItem>) => {
    try {
      if (editingStaff) {
        await updateStaff({
          id: editingStaff.id,
          body: {
            fullName: staffData.fullName || staffData.name,
            phone: staffData.phone ? staffData.phone.trim() : null,
            role:
              staffData.role !== "SUPER_ADMIN"
                ? (staffData.role as "ADMIN" | "STAFF_ORDER" | "STAFF_CONTENT")
                : undefined,
            status: staffData.status,
            avatar: staffData.avatar,
          },
        }).unwrap();
        toast.success("Cập nhật thông tin nhân viên thành công.");
      } else {
        await createStaff({
          fullName: staffData.fullName || staffData.name || "",
          email: staffData.email || "",
          phone: staffData.phone ? staffData.phone.trim() : null,
          pw: staffData.pw || "Password@123",
          pwConfirm: staffData.pwConfirm || staffData.pw || "Password@123",
          role: (staffData.role && staffData.role !== "SUPER_ADMIN"
            ? staffData.role
            : "STAFF_ORDER") as "ADMIN" | "STAFF_ORDER" | "STAFF_CONTENT",
          avatar: staffData.avatar,
        }).unwrap();
        toast.success("Tạo nhân viên mới thành công.");
      }
      setIsDrawerOpen(false);
      setEditingStaff(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi lưu nhân viên."
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStaff) return;
    try {
      await deleteStaff(deletingStaff.id).unwrap();
      toast.success("Xóa tài khoản nhân viên thành công.");
      setDeletingStaff(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Không thể xóa nhân viên này."
      );
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (!togglingStaff) return;
    try {
      const nextStatus =
        togglingStaff.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
      await updateStaff({
        id: togglingStaff.id,
        body: { status: nextStatus },
      }).unwrap();
      toast.success(
        nextStatus === "ACTIVE"
          ? "Mở khóa tài khoản nhân viên thành công."
          : "Đã tạm khóa tài khoản nhân viên."
      );
      setTogglingStaff(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Không thể cập nhật trạng thái nhân viên."
      );
    }
  };

  return (
    <div className="space-y-6">
      <StaffHeader
        onOpenPermissionMatrix={() => setIsPermissionMatrixOpen(true)}
        onAddStaff={handleOpenCreateDrawer}
      />

      <StaffFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilter={resetFilters}
      />

      <StaffTable
        data={staffList}
        totalItems={totalCount}
        page={filters.page}
        pageSize={filters.limit}
        isLoading={isLoading || isFetching}
        onPageChange={(page) => setFilter("page", page)}
        onEdit={handleOpenEditDrawer}
        onDelete={(staff) => setDeletingStaff(staff)}
        onUpdatePassword={(staff) => setPasswordUpdatingStaff(staff)}
        onToggleStatus={(id) => {
          const target = staffList.find((s) => s.id === id);
          if (target) setTogglingStaff(target);
        }}
        onViewPermissions={() => setIsPermissionMatrixOpen(true)}
      />

      <StaffDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingStaff(null);
        }}
        onSubmit={handleSaveStaff}
        editingStaff={
          editingStaff
            ? {
                ...editingStaff,
                name: editingStaff.fullName || editingStaff.name || "",
                roleName: "",
                phone: editingStaff.phone || "",
                avatar: editingStaff.avatar || undefined,
                lastLoginAt: editingStaff.lastLoginAt || "",
              }
            : null
        }
      />

      <UpdatePasswordModal
        isOpen={!!passwordUpdatingStaff}
        staff={passwordUpdatingStaff}
        onClose={() => setPasswordUpdatingStaff(null)}
      />

      <PermissionMatrixModal
        isOpen={isPermissionMatrixOpen}
        onClose={() => setIsPermissionMatrixOpen(false)}
      />

      <Modal
        isOpen={!!deletingStaff}
        onClose={() => {
          if (!isDeleting) setDeletingStaff(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        type="DANGER"
        title="Xóa tài khoản nhân viên"
        description={`Bạn có chắc chắn muốn xóa tài khoản nhân viên "${
          deletingStaff?.fullName || deletingStaff?.name
        }" (${deletingStaff?.code}) không? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa nhân viên"
        cancelText="Bỏ qua"
        size="sm"
      />

      <Modal
        isOpen={!!togglingStaff}
        onClose={() => {
          if (!isUpdating) setTogglingStaff(null);
        }}
        onConfirm={handleConfirmToggleStatus}
        isLoading={isUpdating}
        type={togglingStaff?.status === "ACTIVE" ? "DANGER" : "CONFIRM"}
        title={
          togglingStaff?.status === "ACTIVE"
            ? "Tạm khóa tài khoản nhân viên"
            : "Mở khóa tài khoản nhân viên"
        }
        description={
          togglingStaff?.status === "ACTIVE"
            ? `Bạn có chắc chắn muốn tạm khóa tài khoản của nhân viên "${
                togglingStaff?.fullName || togglingStaff?.name
              }" không? Nhân viên sẽ bị ngắt phiên đăng nhập.`
            : `Mở khóa tài khoản cho nhân viên "${
                togglingStaff?.fullName || togglingStaff?.name
              }" truy cập hệ thống?`
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
