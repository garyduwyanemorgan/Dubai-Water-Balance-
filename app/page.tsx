import NavRail from "@/components/ui/NavRail";
import Scarcity from "./(scenes)/Scarcity";
import Inversion from "./(scenes)/Inversion";
import Compartments from "./(scenes)/Compartments";
import Trajectory from "./(scenes)/Trajectory";
import Gap from "./(scenes)/Gap";

export default function Home() {
  return (
    <>
      <NavRail />
      <main className="scene-scroll">
        <Scarcity />
        <Inversion />
        <Compartments />
        <Trajectory />
        <Gap />
      </main>
    </>
  );
}
