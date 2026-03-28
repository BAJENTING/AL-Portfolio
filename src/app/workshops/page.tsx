import SubPageLayout from '@/components/SubPageLayout';

export default function Workshops() {
  return (
    <SubPageLayout
      eyebrow="Practical Training"
      title="Workshops"
      subtitle="Hands-On Intensive Training Sessions"
      leadTitle="Learn Through Implementation"
      leadDesc="Our workshops go beyond theory, providing you with real-world application of sales and marketing strategies."
      features={[
        { title: 'Sales Intensive', description: '2-day intensive closing and negotiation bootcamp.' },
        { title: 'Marketing Masterclass', description: 'Real-time campaign building for your local listings.' },
        { title: 'Public Speaking', description: 'Training to help you command stages and presentation rooms.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80"
      ctaText="View Schedule"
    />
  );
}
