import Nav from "./sections/nav";
import NavNew from "./sections/nav-new";
import Hero from "./sections/hero";
import Dashboard from "./sections/dashboard";
import Library from "./sections/library";

export default function Home() {
  return (
    <main>
      <NavNew />
      <section id="hero">
        <Hero />
      </section>
      <section id="dashboard">
        <Dashboard />
      </section>
      <section id="library">
        <Library />
      </section>
    </main>
  );
}

