import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-text-muted">Đang tải...</div>}>

    </Suspense>
  );
}
