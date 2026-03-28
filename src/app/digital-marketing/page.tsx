import SubPageLayout from '@/components/SubPageLayout';

export default function DigitalMarketing() {
  return (
    <SubPageLayout
      eyebrow="Modern Marketing"
      title="Digital Marketing"
      subtitle="Dominate Social Media and Generate Elite Leads"
      leadTitle="Digital-First Real Estate"
      leadDesc="Learn the exact digital strategies that powered FilipinoHomes.com to become the country's leading property portal."
      features={[
        { title: 'Social Media Dominance', description: 'Content strategies that convert views into viewing requests.' },
        { title: 'Lead Generation', description: 'Advanced Facebook and Google ad strategies for property projects.' },
        { title: 'Personal Branding', description: 'Establishing yourself as the go-to expert in your local market.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80"
    />
  );
}
