import SubPageLayout from '@/components/SubPageLayout';

export default function SalesMastery() {
  return (
    <SubPageLayout
      eyebrow="Sales Excellence"
      title="Sales Mastery"
      subtitle="Close Faster, Sell More, Scale Higher"
      leadTitle="The Elite Sales Framework"
      leadDesc="From prospecting to closing, this program decodes the exact methodology used to achieve record-breaking sales nationwide."
      features={[
        { title: 'Closing Techniques', description: 'Master the high-stakes negotiation skills required for luxury deals.' },
        { title: 'Pipeline Scaling', description: 'Techniques to maintain a consistent flow of high-intent leads.' },
        { title: 'Client Psychology', description: 'Understand the underlying triggers of modern real estate buyers.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80"
    />
  );
}
