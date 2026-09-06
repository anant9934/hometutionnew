import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-2">Privacy Policy</h1>
      <p className="text-[var(--foreground-secondary)] mb-8">
        <strong>Effective Date:</strong> 07 September 2026 <br />
        <strong>Last Updated:</strong> 07 September 2026
      </p>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-[var(--foreground)]">
        
        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">1. Introduction & Scope</h2>
          <p>
            Welcome to BODH Tuition ("<strong>BODH</strong>", "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>"). 
            We operate the online platform at <a href="https://bodhihometution.in" className="text-[var(--accent)] hover:underline">bodhihometution.in</a>, 
            which connects students/parents with independent home tutors (the "<strong>Platform</strong>").
          </p>
          <p>
            This Privacy Policy explains how we collect, process, protect, and share your personal data when you use the Platform. 
            This Policy is designed to comply with applicable Indian laws, including the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> and the <em>Information Technology Act, 2000</em>.
          </p>
          <p className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm mt-4">
            <strong>Pending Business Confirmation:</strong> The registered legal entity name, corporate address, and formal Data Protection Officer (DPO) details are pending final business incorporation and will be updated here.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">2. Personal Data We Collect & Why</h2>
          <p>We practice data minimisation and only collect data required to operate the marketplace, facilitate tuition services, and ensure platform security.</p>
          
          <div className="space-y-4 mt-4">
            <div className="p-4 border border-[var(--accent-border)] rounded-md">
              <h3 className="font-bold mb-2">A. Account & Authentication Data</h3>
              <p className="text-sm mb-2"><strong>What we collect:</strong> Name, email address, phone number, role selection (Tutor/Student/Parent), and Google OAuth authentication identifiers.</p>
              <p className="text-sm"><strong>Purpose:</strong> To create and manage your account, verify identity, and secure the Platform.</p>
            </div>

            <div className="p-4 border border-[var(--accent-border)] rounded-md">
              <h3 className="font-bold mb-2">B. Parent & Student Data</h3>
              <p className="text-sm mb-2"><strong>What we collect:</strong> Academic class, subjects, learning goals, and relevant locality/pincode. We do not expose exact home addresses publicly.</p>
              <p className="text-sm"><strong>Purpose:</strong> To match students with appropriate tutors in their vicinity and facilitate the booking process.</p>
            </div>

            <div className="p-4 border border-[var(--accent-border)] rounded-md">
              <h3 className="font-bold mb-2">C. Tutor Profile & Verification Data</h3>
              <p className="text-sm mb-2"><strong>What we collect:</strong> Professional qualifications, teaching experience, subjects, pricing, availability, profile image, and official qualification documents.</p>
              <p className="text-sm"><strong>Purpose:</strong> To verify your qualifications during onboarding, display your public profile to prospective students, and establish marketplace trust.</p>
            </div>

            <div className="p-4 border border-[var(--accent-border)] rounded-md">
              <h3 className="font-bold mb-2">D. Booking & Financial Data</h3>
              <p className="text-sm mb-2"><strong>What we collect:</strong> Booking statuses, transaction amounts, timestamps, and payment statuses.</p>
              <p className="text-sm"><strong>Purpose:</strong> To calculate the 10% platform commission, resolve payment disputes, and maintain accounting records. <em>Note: BODH does not directly collect or store your raw Credit Card or UPI credentials.</em></p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">3. Children's Personal Data (Minors)</h2>
          <p>
            BODH Tuition acknowledges that our services are utilized by students who may be under the age of 18 ("Children" or "Child"). 
            Protecting children's privacy is a critical priority and a strict requirement under the DPDP Act.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>Parental Structure:</strong> The Platform technically enforces that accounts for minors must be managed through the <code>PARENT</code> role. Parents must register on behalf of their children and manage all bookings and payments.</li>
            <li><strong>Consent:</strong> By creating a child profile under a Parent account, the parent or legal guardian provides verifiable consent for the processing of the child's academic and matching data.</li>
            <li><strong>Safeguards:</strong> We strictly prohibit tracking, targeted advertising, or behavioral profiling directed at children. A child's private contact information (phone, email, exact address) is never publicly exposed on the Platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">4. Third-Party Service Providers</h2>
          <p>We engage authorized third-party processors to operate the Platform securely. Data sharing is limited strictly to the purpose of their service:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>Cashfree Payments:</strong> Processes all fiat transactions (Trial and Monthly bookings). Cashfree securely handles and vaults your payment credentials.</li>
            <li><strong>Cloudinary:</strong> Provides secure cloud storage for Tutor profile photos and verification documents.</li>
            <li><strong>Google OAuth:</strong> Provides secure Single Sign-On (SSO) authentication.</li>
            <li><strong>Neon / Vercel:</strong> Provides secure database hosting and application infrastructure.</li>
          </ul>
          <p className="mt-4">BODH ensures that all processors are subject to strict confidentiality and security obligations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">5. Data Retention & Security</h2>
          <p>
            <strong>Retention:</strong> We retain personal data only for as long as necessary to fulfill the purposes outlined above, or as required to comply with Indian tax, accounting, and legal obligations. 
            For example, booking and payment records are retained for statutory financial compliance, whereas unverified tutor draft applications may be deleted periodically.
          </p>
          <p className="mt-4">
            <strong>Security:</strong> We implement robust, industry-standard security safeguards. API routes are protected by server-side role-based access control (RBAC). Document uploads are secured via backend SDK streaming to prevent client-side injection. However, no internet transmission is 100% secure, and we handle any suspected personal data breaches in accordance with applicable legal notification requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">6. Your Privacy Rights</h2>
          <p>Under the applicable Indian data protection framework, Data Principals (including Parents on behalf of minors) have the right to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>Access:</strong> Request a summary of the personal data we hold about you.</li>
            <li><strong>Correction & Erasure:</strong> Request correction of inaccurate data or deletion of data no longer necessary for the permitted purpose.</li>
            <li><strong>Withdrawal of Consent:</strong> Withdraw consent for processing (which may require account termination if the data is essential for service delivery).</li>
            <li><strong>Grievance Redressal:</strong> Register a privacy-related complaint with our team.</li>
          </ul>
          <p className="mt-4">To exercise these rights, please email us at <a href="mailto:hello@bodhihometution.in" className="text-[var(--accent)] hover:underline">hello@bodhihometution.in</a>.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mt-8 mb-4 border-b border-[var(--accent-border)] pb-2">7. Changes & Contact</h2>
          <p>
            We may update this Privacy Policy when Indian laws, regulations, or our business practices change. 
            Material changes will be communicated via the Platform or email.
          </p>
          <div className="mt-6 p-6 bg-[var(--background-alt)] rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h3 className="text-lg font-bold mb-2">Data Protection & Grievance Contact</h3>
            <p><strong>Email:</strong> <a href="mailto:hello@bodhihometution.in" className="text-[var(--accent)] hover:underline">hello@bodhihometution.in</a></p>
            <p className="mt-2"><strong>Location:</strong> Patna, Bihar, India</p>
            <p className="text-sm mt-4 text-[var(--foreground-secondary)]">If a formal statutory Data Protection Officer (DPO) or Grievance Officer is designated pursuant to final entity incorporation and classification, their direct contact details will be published here.</p>
          </div>
        </section>
      </div>
      
      <div className="mt-12 pt-8 border-t border-[var(--accent-border)] text-center">
        <Link href="/contact" className="text-[var(--accent)] hover:underline mx-2">Contact Us</Link>
        <Link href="/terms" className="text-[var(--accent)] hover:underline mx-2">Terms of Service</Link>
      </div>
    </div>
  );
}
