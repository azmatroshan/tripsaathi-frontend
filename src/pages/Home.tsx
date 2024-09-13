import isLoggedIn from "../utils/isLoggedIn";
import LandingPage from "./LandingPage";
import ViewTrips from "./ViewTrips";

export default function Home() {

    return (
        isLoggedIn() ? (
            <ViewTrips />
        )
        : (
            <LandingPage />
        )
    );
}