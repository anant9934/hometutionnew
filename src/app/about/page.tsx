import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Bodh Tuition",
  description: "Learn about BODH, Patna's trusted home tuition marketplace.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl text-center">
      <h1 className="font-serif text-4xl md:text-5xl mb-6">About BODH</h1>
      <p className="text-[var(--foreground-secondary)] text-lg mb-8">
        &quot;Tuition should be more than finding someone who can teach a subject.&quot;
      </p>
      <div className="text-left space-y-6 text-[var(--foreground-secondary)]">
        <p>Bodh Tuition was created to ensure that every student in Patna can find the right tutor who matches their specific learning needs.</p>
        <p>We verify our tutors, provide structured learning paths, and offer transparent pricing, bringing accountability and quality to the home tuition experience.</p>
      </div>
    </div>
  );
}
