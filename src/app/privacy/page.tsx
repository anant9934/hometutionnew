export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>At BODH Tuition, we take your privacy seriously. This document outlines how we collect, use, and protect your personal data.</p>
        <h2>Information Collection</h2>
        <p>We collect essential information such as your name, email, and contact details during registration to facilitate tutor matchmaking and payments.</p>
        <h2>Data Protection</h2>
        <p>Your data is secured using industry-standard encryption. We do not sell your data to third parties.</p>
        <p className="mt-8 text-sm text-[var(--foreground-secondary)]">Last updated: September 2026</p>
      </div>
    </div>
  );
}
