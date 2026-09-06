import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-2">Terms of Service</h1>
      <p className="text-[var(--foreground-secondary)] mb-8">
        <strong>Effective Date:</strong> 07 September 2026 <br />
        <strong>Last Updated:</strong> 07 September 2026
      </p>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-[var(--foreground)]">
        
        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">1. Introduction & Acceptance</h2>
          <p>
            Welcome to BODH Tuition. By accessing or using the platform at <a href="https://bodhihometution.in" className="text-[var(--accent)] hover:underline">bodhihometution.in</a> (the "<strong>Platform</strong>"), 
            you agree to be bound by these Terms of Service ("<strong>Terms</strong>"). These Terms constitute a legally binding agreement in accordance with the <em>Indian Contract Act, 1872</em> and the <em>Information Technology Act, 2000</em>.
          </p>
          <p className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm mt-4">
            <strong>Pending Business Confirmation:</strong> The registered legal entity name and exact GST/Tax applicability are pending final confirmation and will be published here upon incorporation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">2. BODH's Role as a Marketplace Intermediary</h2>
          <p>
            BODH Tuition operates strictly as an <strong>online marketplace intermediary</strong> (as defined under the IT Act and Consumer Protection (E-Commerce) Rules, 2020). 
            We provide a technology platform that connects Parents and Students seeking educational services with independent Home Tutors.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>Not an Employer:</strong> Tutors are independent service providers. They are not employees, agents, or representatives of BODH Tuition.</li>
            <li><strong>Not an Educational Institution:</strong> BODH does not provide tuition directly and does not guarantee specific examination marks, ranks, or academic outcomes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">3. Account Eligibility & Minors</h2>
          <p>
            To use the Platform, you must be capable of forming a legally binding contract under Indian law. 
            If a Student is a minor (under 18 years of age), a Parent or Legal Guardian must create a <code>PARENT</code> account, agree to these Terms, and manage all bookings and payments on behalf of the child. Minors are strictly prohibited from contracting for paid services independently on the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">4. Tutor Verification & Disclaimers</h2>
          <p>
            BODH requires Tutors to submit qualification documents and profile information during onboarding. We may review these documents to assign a <code>VERIFIED</code> status. 
          </p>
          <p className="mt-4 font-semibold text-red-600 dark:text-red-400">Important Disclaimer:</p>
          <p>
            While we review submitted documents, <strong>verification does not constitute a guarantee of a tutor's future conduct, teaching quality, or absolute identity</strong>. 
            BODH does not currently conduct independent criminal background checks or police verifications. Parents are strongly advised to exercise their own discretion and supervision during home tuition sessions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">5. Booking, Payments & Platform Commission</h2>
          <ul className="list-disc pl-5 space-y-4 mt-4">
            <li><strong>Booking Acceptance:</strong> A booking request (Trial or Monthly) is only confirmed once the selected Tutor explicitly accepts it and the required payment is processed.</li>
            <li><strong>Payments:</strong> All payments are securely processed by our authorized payment aggregator, Cashfree. Payment obligations are settled in Indian Rupees (INR).</li>
            <li><strong>Platform Commission:</strong> BODH charges a standard <strong>10% platform commission</strong> on the total transaction value. For example, on a ₹3,000 tuition booking, BODH retains ₹300, and the Tutor is credited ₹2,700 via our Commission Ledger.</li>
            <li><strong>Anti-Circumvention:</strong> Users agree not to misuse the Platform to evade the platform commission. Attempting to arrange off-platform payments for a Tutor introduced through BODH is a material breach of these Terms and will result in immediate account termination.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">6. Refunds & Cancellations</h2>
          <p>BODH adheres to the Consumer Protection Act, 2019 by providing transparent cancellation and refund rights:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>Tutor Rejection/No-Show:</strong> If a Tutor rejects a booking request or fails to deliver the agreed tuition, the Parent is entitled to a full refund of the prepaid amount.</li>
            <li><strong>Parent Cancellation:</strong> Cancellations made by the Parent prior to the commencement of the tuition schedule may be subject to a proportional refund, minus standard processing fees, depending on the notice period provided.</li>
            <li><strong>Disputes:</strong> If a service dispute arises (e.g., non-delivery of classes), Parents must raise a grievance with BODH support within 7 days. BODH will mediate the dispute based on platform logs and attendance records.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">7. Child Safety & Zero Tolerance Policy</h2>
          <p>
            BODH enforces a strict Zero Tolerance Policy regarding child safety, in alignment with the <em>Protection of Children from Sexual Offences Act, 2012 (POCSO)</em>.
          </p>
          <p className="mt-4">Tutors must maintain absolute professional conduct. The following are strictly prohibited:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 mb-4">
            <li>Inappropriate, abusive, or unprofessional communication.</li>
            <li>Physical punishment, harassment, or exploitation.</li>
            <li>Unauthorized photography, video recording, or sharing of a child's personal information.</li>
          </ul>
          <p>
            Violations will result in immediate permanent suspension from the Platform. Where conduct constitutes a suspected criminal offence, BODH will fully cooperate with law enforcement and regulatory authorities as required by Indian law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">8. Limitation of Liability & Indemnity</h2>
          <p>
            Subject to mandatory statutory consumer remedies under Indian law, BODH shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Platform or the home tuition services provided by independent Tutors. 
            You agree to indemnify BODH from claims arising out of your intentional misconduct, fraud, or violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">9. Governing Law, Jurisdiction & Grievances</h2>
          <p>
            These Terms shall be governed by the laws of India. Subject to applicable mandatory consumer protection laws, any disputes shall be subject to the appropriate jurisdiction of the courts at Patna, Bihar, India.
          </p>
          <div className="mt-6 p-6 bg-[var(--background-alt)] rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h3 className="text-lg font-bold mb-2">Grievance Redressal</h3>
            <p>If you have a complaint regarding a booking, a tutor, or a technical issue, please contact our support team:</p>
            <p className="mt-2"><strong>Email:</strong> <a href="mailto:hello@bodhihometution.in" className="text-[var(--accent)] hover:underline">hello@bodhihometution.in</a></p>
            <p className="text-sm mt-4 text-[var(--foreground-secondary)]">Formal Grievance Officer details required under the E-Commerce Rules will be published here upon final business incorporation.</p>
          </div>
        </section>
      </div>
      
      <div className="mt-12 pt-8 border-t border-[var(--accent-border)] text-center">
        <Link href="/contact" className="text-[var(--accent)] hover:underline mx-2">Contact Us</Link>
        <Link href="/privacy" className="text-[var(--accent)] hover:underline mx-2">Privacy Policy</Link>
      </div>
    </div>
  );
}
