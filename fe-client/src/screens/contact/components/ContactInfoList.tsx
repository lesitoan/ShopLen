import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { CONTACT_INFO_ITEMS } from "../constants";

const ICON_MAP = {
  MapPin,
  Phone,
  Mail,
  Clock,
};

export default function ContactInfoList() {
  return (
    <div className="flex flex-col gap-3.5 w-full">
      {CONTACT_INFO_ITEMS.map((item) => {
        const IconComponent = ICON_MAP[item.iconName];
        return (
          <div
            key={item.id}
            className="border border-border border-l-4 border-l-primary rounded-lg bg-surface p-4 flex items-start justify-between gap-3 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <IconComponent size={16} />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11.5px] font-semibold text-text-secondary uppercase tracking-wider">
                  {item.title}
                </span>
                <span className="text-[14px] font-bold text-text-primary truncate">
                  {item.value}
                </span>
                {item.subValue && (
                  <span className="text-[12px] text-text-secondary">
                    {item.subValue}
                  </span>
                )}
              </div>
            </div>

            {item.actionHref && item.actionLabel && (
              <a
                href={item.actionHref}
                className="bg-primary-light hover:bg-primary/20 text-secondary text-[12px] font-semibold px-3 py-1.5 rounded transition-colors shrink-0 self-center"
              >
                {item.actionLabel}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
