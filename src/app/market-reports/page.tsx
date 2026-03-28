import SubPageLayout from '@/components/SubPageLayout';

export default function MarketReports() {
  return (
    <SubPageLayout
      eyebrow="Market Intelligence"
      title="Market Reports"
      subtitle="Data-Driven Insights into Philippine Real Estate"
      leadTitle="Understand the Numbers"
      leadDesc="Our reports provide an in-depth analysis of property price trends and development projects nationwide."
      features={[
        { title: 'Price Index Reports', description: 'Updated data on resale and pre-selling property values.' },
        { title: 'Project Watchlist', description: 'Evaluation of the latest developments from top builders.' },
        { title: 'Demographic Shifts', description: 'Analysis of buyer behavior across different Philippine regions.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80"
      ctaText="Download Reports"
    />
  );
}
