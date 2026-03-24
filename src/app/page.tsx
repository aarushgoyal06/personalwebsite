import HeroLoader from "@/components/hero/HeroLoader";
import BelowFold from "@/components/hero/BelowFold";
import brickData from "../../public/data/taj-mahal-bricks.json";

export default function HomePage() {
  return (
    <div>
      <HeroLoader bricks={brickData} />
      <BelowFold />
    </div>
  );
}
