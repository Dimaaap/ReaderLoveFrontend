import { FeaturesSection, MainPageSection, MainSection, ReviewsSection } from "@/components";
import { sections } from "../../config"
import { LinksSection } from "@/components/shared/LinksSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex-col gap-0 w-full">
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
