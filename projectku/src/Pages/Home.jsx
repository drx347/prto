import HomeDesktop from "../ui/desktop/HomeDesktop";
import HomeMobile from "../ui/mobile/HomeMobile";
import HomeTablet from "../ui/tablet/HomeTablet";
import { useUiVariant } from "../ui/device";

export default function Home() {
  const variant = useUiVariant();
  if (variant === "mobile") return <HomeMobile />;
  if (variant === "tablet") return <HomeTablet />;
  return <HomeDesktop />;
}
