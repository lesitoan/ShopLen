"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  UserPlus,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  BellRing,
} from "lucide-react";

import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

export default function DashboardScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for Dashboard metrics
  const stats = [
    {
      title: "Doanh thu hôm nay",
      value: "1,450,000 đ",
      change: "+12.5% so với hôm qua",
      icon: <TrendingUp size={20} />,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Đơn hàng mới",
      value: "12 đơn",
      change: "3 đơn chưa xử lý",
      icon: <ShoppingBag size={20} />,
      color: "bg-primary-light text-secondary",
    },
    {
      title: "Đơn chờ thanh toán",
      value: "5 đơn",
      change: "Hạn hủy tự động sau 15p",
      icon: <Clock size={20} />,
      color: "bg-warning/15 text-warning",
    },
    {
      title: "Khách hàng mới",
      value: "8 khách",
      change: "+2 đăng ký thành viên",
      icon: <UserPlus size={20} />,
      color: "bg-info/10 text-info",
    },
  ];

  // Mock Recent Orders list
  const recentOrders = [
    {
      id: "DH2026",
      customer: "Nguyễn Văn A",
      phone: "0912345678",
      total: 120000,
      status: "pending",
      statusLabel: "Chờ xác nhận",
      date: "14:24 - 14/07/2026",
    },
    {
      id: "DH2025",
      customer: "Trần Thị B",
      phone: "0987654321",
      total: 85000,
      status: "paid",
      statusLabel: "Đã thanh toán",
      date: "14:10 - 14/07/2026",
    },
    {
      id: "DH2024",
      customer: "Phạm Văn C",
      phone: "0905556667",
      total: 210000,
      status: "processing",
      statusLabel: "Đang xử lý",
      date: "11:30 - 14/07/2026",
    },
    {
      id: "DH2023",
      customer: "Lê Thị D",
      phone: "0934445556",
      total: 45000,
      status: "shipping",
      statusLabel: "Đang giao",
      date: "09:15 - 14/07/2026",
    },
    {
      id: "DH2022",
      customer: "Vũ Văn E",
      phone: "0967778889",
      total: 350000,
      status: "completed",
      statusLabel: "Hoàn thành",
      date: "Hôm qua",
    },
  ];

  // Mock Top Selling Products list
  const topProducts = [
    { name: "Móc khóa bé heo dễ thương", sales: 48, stock: 12 },
    { name: "Móc khóa bông hoa hướng dương", sales: 36, stock: 2 },
    { name: "Thú bông chú thỏ trắng xù", sales: 24, stock: 8 },
    { name: "Móc khóa tulip len màu pastel", sales: 18, stock: 25 },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Dashboard Tổng Quan</h1>
          <p className="text-[13px] text-text-secondary">
            Báo cáo tình hình bán hàng trực tiếp trong ngày hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-full border-border bg-white text-text-secondary"
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => alert("Mô phỏng: Có đơn hàng mới vừa được đặt qua client!")}
            className="flex items-center gap-1.5 rounded-full shadow-sm"
          >
            <BellRing size={14} />
            <span>Mô phỏng đơn mới</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg shrink-0 ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span className="text-[24px] font-bold text-text-primary">{stat.value}</span>
              <p className="text-[11px] text-text-secondary mt-1 flex items-center gap-1">
                <span className="text-emerald-500 font-medium">{stat.change.split(" ")[0]}</span>
                <span>{stat.change.substring(stat.change.indexOf(" ") + 1)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Graphs & Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: SVG Revenue Chart */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-text-primary">Biểu Đồ Doanh Thu Tuần</h3>
              <p className="text-[11px] text-text-secondary">Thống kê doanh số bán từ ngày 08/07 - 14/07</p>
            </div>
            <div className="flex items-center gap-1 bg-background p-0.5 rounded-lg border border-border">
              <button className="text-[11px] font-semibold bg-white text-secondary shadow-sm rounded-md px-2.5 py-1">Tuần này</button>
              <button className="text-[11px] font-semibold text-text-secondary hover:text-text-primary px-2.5 py-1">Tháng này</button>
            </div>
          </div>

          {/* Gorgeous SVG Area & Line Chart */}
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f1f4" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f1f4" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f1f4" strokeWidth="1" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="#E5E7EB" strokeWidth="1.5" />

              {/* Area Under Curve */}
              <path
                d="M 10 190 Q 90 120 170 140 T 330 60 T 490 30 L 490 190 L 10 190 Z"
                fill="url(#chart-gradient)"
                opacity="0.25"
              />

              {/* Curve Line */}
              <path
                d="M 10 190 Q 90 120 170 140 T 330 60 T 490 30"
                fill="none"
                stroke="#B85E66"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="10" cy="190" r="3.5" fill="#FFFFFF" stroke="#B85E66" strokeWidth="1.5" />
              <circle cx="90" cy="125" r="3.5" fill="#FFFFFF" stroke="#B85E66" strokeWidth="1.5" />
              <circle cx="170" cy="140" r="3.5" fill="#FFFFFF" stroke="#B85E66" strokeWidth="1.5" />
              <circle cx="250" cy="100" r="3.5" fill="#FFFFFF" stroke="#B85E66" strokeWidth="1.5" />
              <circle cx="330" cy="60" r="3.5" fill="#FFFFFF" stroke="#B85E66" strokeWidth="1.5" />
              <circle cx="410" cy="45" r="3.5" fill="#FFFFFF" stroke="#B85E66" strokeWidth="1.5" />
              <circle cx="490" cy="30" r="3.5" fill="#FFFFFF" stroke="#B85E66" strokeWidth="1.5" />

              {/* Defs for Gradient */}
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F9B4C7" />
                  <stop offset="100%" stopColor="#FFF1F4" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Chart X-Axis Labels */}
            <div className="flex justify-between mt-2 px-1 text-[10px] text-text-secondary font-medium">
              <span>08/07</span>
              <span>09/07</span>
              <span>10/07</span>
              <span>11/07</span>
              <span>12/07</span>
              <span>13/07</span>
              <span>Hôm nay</span>
            </div>
          </div>
        </div>

        {/* Right: Warnings & Top Products */}
        <div className="space-y-6">
          {/* Low Stock Warnings */}
          <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
            <h3 className="text-[14px] font-bold text-text-primary mb-3.5 flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-warning" />
              <span>Sản Phẩm Sắp Hết Hàng</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-warning/5 rounded-xl border border-warning/10">
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold truncate text-text-primary">Móc khóa Hoa Hướng Dương</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Tồn kho còn lại: <strong className="text-secondary">2 cái</strong></p>
                </div>
                <a href="/san-pham">
                  <Button variant="outline" size="sm" className="py-1 px-3 text-[11px] rounded-full border-warning/40 text-warning-active hover:bg-warning/10">
                    Nhập hàng
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
            <h3 className="text-[14px] font-bold text-text-primary mb-3.5">Top Sản Phẩm Bán Chạy</h3>
            <div className="space-y-3.5">
              {topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-[12px]">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate text-text-primary">{p.name}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Còn {p.stock} trong kho</p>
                  </div>
                  <span className="font-bold text-secondary text-right shrink-0 bg-primary-light px-2.5 py-1 rounded-full text-[11px]">
                    {p.sales} đã bán
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-text-primary">Đơn Hàng Gần Đây</h3>
            <p className="text-[11px] text-text-secondary">Theo dõi 5 đơn hàng mới phát sinh gần nhất</p>
          </div>
          <a href="/don-hang">
            <Button variant="outline" size="sm" className="rounded-full border-border bg-white text-text-secondary text-[12px]">
              <span>Xem tất cả đơn</span>
              <ArrowUpRight size={14} className="ml-1" />
            </Button>
          </a>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-border bg-background/50 text-text-secondary uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3">Mã đơn</th>
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Số điện thoại</th>
                <th className="p-3">Tổng tiền</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ngày đặt</th>
                <th className="p-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-background/25 transition-colors">
                  <td className="p-3 font-semibold text-secondary">{order.id}</td>
                  <td className="p-3 font-medium">{order.customer}</td>
                  <td className="p-3 text-text-secondary">{order.phone}</td>
                  <td className="p-3 font-bold">{formatPrice(order.total)}</td>
                  <td className="p-3">
                    <Badge variant={order.status as any}>{order.statusLabel}</Badge>
                  </td>
                  <td className="p-3 text-text-secondary">{order.date}</td>
                  <td className="p-3 text-right">
                    <a href={`/don-hang/${order.id}`}>
                      <Button variant="ghost" size="sm" className="py-1 px-3 text-[11px] text-secondary hover:bg-primary-light">
                        Xem chi tiết
                      </Button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
