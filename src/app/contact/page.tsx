export default function ContactPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-6">Contact Us</h1>
      <p className="text-lg text-[var(--foreground-secondary)] mb-8">
        Have questions? We are here to help. Reach out to our support team for any inquiries regarding home tuition in Patna.
      </p>
      <div className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-8">
        <h2 className="text-xl font-medium mb-4">Support Email</h2>
        <a href="mailto:support@bodhtuition.in" className="text-[var(--accent)] hover:underline text-lg">support@bodhtuition.in</a>
        
        <h2 className="text-xl font-medium mt-8 mb-4">Helpline</h2>
        <p className="text-lg">+91 99999 99999</p>
      </div>
    </div>
  );
}
