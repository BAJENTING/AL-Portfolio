import SubPageLayout from '@/components/SubPageLayout';

export default function Webinars() {
  return (
    <SubPageLayout
      eyebrow="Online Learning"
      title="Webinars"
      subtitle="Accessible Expertise from Anywhere"
      leadTitle="Knowledge at Your Fingertips"
      leadDesc="Join our weekly online sessions covering the latest market trends and digital selling techniques."
      features={[
        { title: 'The PropTech Shift', description: 'Monthly webinar series on new technologies in real estate.' },
        { title: 'Digital Sales 101', description: 'Perfect for beginners looking to start their online journey.' },
        { title: 'Market Updates', description: 'Quarterly review of real estate performance in the Philippines.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1600&q=80"
      ctaText="Join Next Webinar"
    />
  );
}
