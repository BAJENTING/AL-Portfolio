import SubPageLayout from '@/components/SubPageLayout';

export default function TeamLeadership() {
  return (
    <SubPageLayout
      eyebrow="Leadership Development"
      title="Team Leadership"
      subtitle="Build, Manage, and Scale Elite Teams"
      leadTitle="Culture, Systems, and Performance"
      leadDesc="Learn the frameworks used to manage 15,000+ professionals. This program focuses on building a high-performance culture that attracts and retains top talent."
      features={[
        { title: 'Recruitment Systems', description: 'Automate your talent pipeline to find the best agents in your city.' },
        { title: 'Performance Metrics', description: 'Implement data-driven management to ensure consistent growth.' },
        { title: 'Culture Building', description: 'Create a brand environment that fosters loyalty and elite performance.' },
      ]}
      heroImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80"
    />
  );
}
