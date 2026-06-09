"use client";

import { useState } from "react";
import { FeaturesSection, MainPageSection, MainSection, ReviewsSection } from "@/components";
import { sections } from "../../config"
import { LinksSection } from "@/components/shared/LinksSection";
import { Footer } from "@/components/Footer";
import { SignUpModal } from "@/components/modals/SignUpModal";
import { useSendOtpModalStore } from "@/states";
import { SendOtpModal } from "@/components/modals/SendOtpModal";

export default function Home() {

  const [isOpenModal, setIsOpenModal] = useState(true)
  const { sendOtpModalStoreOpen } = useSendOtpModalStore()

  return (
    <div className="flex-col gap-0 w-full relative z-10">
      { isOpenModal && <SignUpModal /> }
      { sendOtpModalStoreOpen && <SendOtpModal /> }
      <MainSection />

      { sections.map((section, index) => (
        <MainPageSection key={ index } imageSrc={section.imageSrc} header={ section.header }
        textFirst={ section.textFirst } textSecond={ section.textSecond }
        backgroundColor={ section?.backgroundColor || undefined } />
      )) }
      
      <ReviewsSection />

      <FeaturesSection />

      <LinksSection />

      <Footer />
    </div>
  );
}
