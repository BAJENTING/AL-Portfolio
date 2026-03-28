import SubPageLayout from '@/components/SubPageLayout';

export default function RealEstateBasics() {
  return (
    <SubPageLayout
      eyebrow="Foundational Training"
      title="Real Estate Basics"
      subtitle="The Essential Toolkit for Every Professional"
      leadTitle="Build a Solid Foundation"
      leadDesc="Designed for beginners, this program covers the core principles of real estate in the Philippines, from licensing to basic property laws."
      features={[
        { title: 'Market Fundamentals', description: 'Understand how property values are determined and market cycles.' },
        { title: 'Networking 101', description: 'Strategies to build your first database of potential clients.' },
        { title: 'Ethical Standards', description: 'Operating with integrity in the Philippine real estate landscape.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80"
    />
  );
}
