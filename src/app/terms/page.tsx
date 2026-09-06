export default function TermsPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>Welcome to BODH Tuition. By using our platform, you agree to these terms.</p>
        <h2>For Students & Parents</h2>
        <p>All payments are processed securely through Cashfree. Trial classes are subject to tutor availability.</p>
        <h2>For Tutors</h2>
        <p>A standard platform fee (commission) applies to all completed bookings. You are expected to maintain professional conduct.</p>
        <p className="mt-8 text-sm text-[var(--foreground-secondary)]">Last updated: September 2026</p>
      </div>
    </div>
  );
}
