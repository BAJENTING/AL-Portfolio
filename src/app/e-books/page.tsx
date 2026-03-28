import SubPageLayout from '@/components/SubPageLayout';

export default function EBooks() {
  return (
    <SubPageLayout
      eyebrow="E-Learning Resources"
      title="E-books"
      subtitle="Master the Market at Your Own Pace"
      leadTitle="Digital Guides to Success"
      leadDesc="Exclusive e-books by Anthony Leuterio covering various facets of the real estate industry."
      features={[
        { title: 'The Filipino Investor', description: 'A complete guide to property investing in the Philippines.' },
        { title: 'RE-Digital Transformation', description: 'How to scale your real estate business using modern technology.' },
        { title: 'The Closing Secrets', description: 'Proven methodology for closing high-value property deals.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1491843331757-377b9c75d74c?w=1600&q=80"
      ctaText="Browse E-books"
    />
  );
}
