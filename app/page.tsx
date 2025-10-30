import Nav from "./sections/nav";
import Hero from "./sections/hero";
import Dashboard from "./sections/dashboard";
import Biblioteca from "./sections/biblioteca";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Dashboard />
      <Biblioteca />
    </main>
  );
}

