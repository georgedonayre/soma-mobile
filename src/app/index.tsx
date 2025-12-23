import { Redirect } from "expo-router";
import { routes } from "../utils/routes";

export default function Index() {
  return <Redirect href={routes.dashboard} />;
}
