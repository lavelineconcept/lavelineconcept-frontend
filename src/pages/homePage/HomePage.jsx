import Navigation from "../../components/navigation/navigation";
import Hero from "../../components/hero/hero";
import Categories from "../../components/categories/categories";
import LastAdded from "../../components/lastAdded/lastAdded";
import Subscription from "../../components/subscription/subscription";
import WeStory from "../../components/weStory/weStory";
import Privileges from "../../components/privileges/privileges";
import VisionMission from "../../components/visionAndMission/visionMission";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <Hero />
      <Categories />
      <LastAdded />
      <Subscription />
      <WeStory />
      <Privileges />
      <VisionMission />
    </>
  );
}