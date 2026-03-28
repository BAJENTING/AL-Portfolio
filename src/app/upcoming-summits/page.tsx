import SubPageLayout from '@/components/SubPageLayout';

export default function UpcomingSummits() {
  return (
    <SubPageLayout
      eyebrow="Global Networking"
      title="Upcoming Summits"
      subtitle="The Philippines' Most Influential Property Events"
      leadTitle="Experience the Future of Real Estate"
      leadDesc="Join Anthony Leuterio and other industry giants at our upcoming flagship summits across the country."
      features={[
        { title: 'Visionaries Summit 2024', description: 'Our annual flagship event at the SMX Convention Center.' },
        { title: 'PropTech APAC', description: 'Exploring the intersection of technology and property in the region.' },
        { title: 'FilipinoHomes Gala', description: 'Celebrating excellence in the real estate service industry.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1540575861501-7c00117fb3c3?w=1600&q=80"
      ctaText="Register Now"
    />
  );
}
