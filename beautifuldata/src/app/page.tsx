import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { Portfolio } from "@/components/portfolio";
import { Pricing } from "@/components/pricing";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
