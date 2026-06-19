"use client";

import { FeaturesSection, MainPageSection, MainSection, ReviewsSection } from "@/components";
import { sections } from "../../config"
import { LinksSection } from "@/components/shared/LinksSection";
import { Footer } from "@/components/Footer";
import { SignUpModal } from "@/components/modals/SignUpModal";
import { useForgotPasswordModalState, useLoginModalStore, useSendOtpModalStore, useSignUpModalStore, useUserSignUpStatus } from "@/states";
import { SendOtpModal } from "@/components/modals/SendOtpModal";
import { LoginModal } from "@/components/modals/LoginModal";
import { ForgotPasswordModal } from "@/components/modals/ForgotPasswordModal"

export default function Home() {

  const { signUpModalOpen } = useSignUpModalStore();
  const { loginModalOpen } = useLoginModalStore();
  const { sendOtpModalStoreOpen } = useSendOtpModalStore();
  const { needRegister, needOtp } = useUserSignUpStatus();
  const { forgotPasswordModalOpen } = useForgotPasswordModalState()

  return (
    <div className="flex-col gap-0 w-full relative z-10">
      { loginModalOpen && <LoginModal /> }
      { signUpModalOpen && needRegister && <SignUpModal /> }
      { sendOtpModalStoreOpen && needOtp && <SendOtpModal /> }
      { forgotPasswordModalOpen && <ForgotPasswordModal /> }
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
