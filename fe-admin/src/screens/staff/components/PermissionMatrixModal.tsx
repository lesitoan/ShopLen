"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { MOCK_PERMISSION_MATRIX } from "../constants";

interface PermissionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PermissionMatrixModal({
  isOpen,
  onClose,
}: PermissionMatrixModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      type="CONFIRM"
      title="Ma trận phân quyền nhân viên (RBAC - 4 Vai trò)"
      confirmText="Đóng"
      size="lg"
    >
      <div className="space-y-6 py-2">
        <p className="text-xs text-text-muted">
          Bảng quy định chi tiết các quyền hạn thao tác hệ thống dành cho 4 nhóm vai trò chính: <strong>Super Admin</strong>, <strong>Admin</strong>, <strong>CTV check đơn</strong> và <strong>CTV đăng bài</strong>.
        </p>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-muted text-text-secondary font-semibold uppercase border-b border-border">
              <tr>
                <th className="px-4 py-3">Danh mục quyền</th>
                <th className="px-3 py-3 text-center">Super Admin</th>
                <th className="px-3 py-3 text-center">Admin</th>
                <th className="px-3 py-3 text-center">CTV check đơn</th>
                <th className="px-3 py-3 text-center">CTV đăng bài</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_PERMISSION_MATRIX.map((group) => (
                <React.Fragment key={group.groupName}>
                  <tr className="bg-surface-muted/60">
                    <td
                      colSpan={5}
                      className="px-4 py-2 font-bold text-primary uppercase text-[11px] tracking-wider"
                    >
                      {group.groupName}
                    </td>
                  </tr>
                  {group.permissions.map((perm) => (
                    <tr key={perm.key} className="hover:bg-surface-hover transition-colors">
                      <td className="px-4 py-2.5 text-text-primary font-medium">{perm.label}</td>
                      <td className="px-3 py-2.5 text-center">
                        {perm.superAdminHas ? (
                          <Check className="w-4 h-4 text-status-success mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-text-muted/40 mx-auto" />
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {perm.adminHas ? (
                          <Check className="w-4 h-4 text-status-success mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-text-muted/40 mx-auto" />
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {perm.staffOrderHas ? (
                          <Check className="w-4 h-4 text-status-success mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-text-muted/40 mx-auto" />
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {perm.staffContentHas ? (
                          <Check className="w-4 h-4 text-status-success mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-text-muted/40 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
