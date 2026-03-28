import SubPageLayout from '@/components/SubPageLayout';

export default function Templates() {
  return (
    <SubPageLayout
      eyebrow="Professional Resources"
      title="Templates"
      subtitle="The Complete Toolkit for Real Estate Excellence"
      leadTitle="Work Smarter, Not Harder"
      leadDesc="Download our collection of proven legal contracts, marketing templates, and sales scripts."
      features={[
        { title: 'Legal Contracts', description: 'RESA-compliant listing agreements and sales documents.' },
        { title: 'Marketing Templates', description: 'Proven social media and email campaign structures.' },
        { title: 'Sales Scripts', description: 'Frameworks for cold calling, following up, and closing.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1454165833762-02651d28903d?w=1600&q=80"
      ctaText="Access Toolkit"
    />
  );
}
