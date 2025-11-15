import Nav from "./sections/nav";
import NavNew from "./sections/nav-new";
import Hero from "./sections/hero";
import Dashboard from "./sections/dashboard";
import Biblioteca from "./sections/biblioteca";

export default function Home() {
  return (
    <main>
      <NavNew />
      <Hero />
      <Dashboard />
      <Biblioteca />
    </main>
  );
}

