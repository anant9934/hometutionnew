export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-6">How BODH Tuition Works</h1>
      <div className="space-y-12 mt-12">
        <div className="flex gap-6">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xl font-bold shrink-0">1</div>
          <div>
            <h3 className="text-2xl font-medium mb-2">Find Your Perfect Tutor</h3>
            <p className="text-lg text-[var(--foreground-secondary)]">Browse through our verified tutors in Patna based on subject, location, and teaching style.</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xl font-bold shrink-0">2</div>
          <div>
            <h3 className="text-2xl font-medium mb-2">Book a Session</h3>
            <p className="text-lg text-[var(--foreground-secondary)]">Request a trial or standard session. Securely pay online via our integrated payment gateway.</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xl font-bold shrink-0">3</div>
          <div>
            <h3 className="text-2xl font-medium mb-2">Learn & Grow</h3>
            <p className="text-lg text-[var(--foreground-secondary)]">Engage in high-quality home tuition and utilize our Learning Ecosystem for quizzes and progress tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
