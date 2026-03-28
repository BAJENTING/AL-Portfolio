import SubPageLayout from '@/components/SubPageLayout';

export default function LegalCompliance() {
  return (
    <SubPageLayout
      eyebrow="Regulatory Training"
      title="Legal Compliance"
      subtitle="Operating Within the RESA Law Framework"
      leadTitle="Safe and Legal Transactions"
      leadDesc="Protect yourself and your clients by understanding the critical legal aspects of real estate transactions in the Philippines."
      features={[
        { title: 'RESA Law Compliance', description: 'Deep dive into the Real Estate Service Act and its requirements.' },
        { title: 'Taxation and Fees', description: 'Understand Capital Gains, Documentary Stamps, and Transfer Taxes.' },
        { title: 'Contract Mastery', description: 'Protect your interest and commissions through solid legal documentation.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80"
    />
  );
}
