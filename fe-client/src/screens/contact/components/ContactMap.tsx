import React from "react";
import { MapPin } from "lucide-react";

export default function ContactMap() {
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden flex flex-col w-full">
      <div className="bg-primary-light/40 px-4 py-3 border-b border-border flex items-center gap-2">
        <MapPin size={16} className="text-secondary shrink-0" />
        <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
          Vị trí cửa hàng tại Đà Nẵng
        </h3>
      </div>

      <div className="relative w-full h-[260px] md:h-[340px] bg-background">
        <iframe
          title="Vị trí Tiệm Len Nhà Kiều tại Đà Nẵng"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122691.61466034177!2d108.1363604!3d16.0470793!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792259a3d%3A0x1fd0d0554d65a3ef!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
