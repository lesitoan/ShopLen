import React from "react";
import ContactHeader from "./components/ContactHeader";
import ContactInfoList from "./components/ContactInfoList";
import ContactMap from "./components/ContactMap";
import ContactForm from "./components/ContactForm";

export default function ContactScreen() {
  return (
    <main className="flex-1 flex flex-col">
      <ContactHeader />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-8 w-full">
        <div className="flex flex-col md:flex-row gap-6 md:items-start w-full">
          <div className="w-full md:w-[380px] lg:w-[420px] shrink-0">
            <ContactInfoList />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <ContactForm />
          </div>
        </div>

        <ContactMap />
      </div>
    </main>
  );
}
