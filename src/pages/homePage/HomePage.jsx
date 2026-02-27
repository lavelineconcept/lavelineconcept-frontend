import Hero from "../../components/hero/hero";
import Categories from "../../components/categories/categories";
import LastAdded from "../../components/lastAdded/lastAdded";
import Subscription from "../../components/subscription/subscription";
import WeStory from "../../components/weStory/weStory";
import Privileges from "../../components/privileges/privileges";
import VisionMission from "../../components/visionAndMission/visionMission";
import SlideText from "../../components/slideText/slideText";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SlideText />
      <Categories />
      <LastAdded />
      <Subscription />
      <WeStory />
      <Privileges />
      <VisionMission />
    </>
  );
}