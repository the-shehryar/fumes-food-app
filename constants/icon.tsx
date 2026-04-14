import { RouteNames } from "@/types/type";
import { Feather, Ionicons } from "@expo/vector-icons";
import { JSX } from "react";

const Icon: Record<RouteNames, (props: any) => JSX.Element> = {
  index: (props: any) => <Ionicons name="home-outline" size={22} {...props} />,
  search: (props: any) => <Ionicons name="search-outline" size={22} {...props} />,
  cart: (props: any) => <Ionicons name={"cart-outline"} size={22} {...props} />,
  profile: (props: any) => (
    <Ionicons name="person-outline" size={22} {...props} />
  ),
};

export default Icon