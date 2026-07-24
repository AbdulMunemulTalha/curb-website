import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LiveCount from "@/components/LiveCount";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import Footer from "@/components/Footer";

export default function Home({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const referredByCode = searchParams?.ref ?? null;
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero referredByCode={referredByCode} />
      <LiveCount />
      <Features />
      <SocialProof referredByCode={referredByCode} />
      <Footer />
    </main>
  );
}
