import DonationSection from '../components/sections/DonationSection';
import FinalHelpCta from '../components/sections/FinalHelpCta';
import HelpHeroSection from '../components/sections/HelpHeroSection';
import ShareSection from '../components/sections/ShareSection';
import VolunteerSection from '../components/sections/VolunteerSection';
import WaysSection from '../components/sections/WaysSection';

export default function ComoAjudarPage() {
  return (
    <>
      <HelpHeroSection />
      <WaysSection />
      <DonationSection />
      <VolunteerSection />
      <ShareSection />
      <FinalHelpCta />
    </>
  );
}
