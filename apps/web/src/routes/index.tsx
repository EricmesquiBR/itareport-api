import { Link, createFileRoute } from "@tanstack/react-router";

import Footer from "@/components/footer";
import Header from "@/components/header";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <Header />
      <div className="landingpage">
        <div className="text-center text-2xl">
          <div>
            <h2 className="text-4xl pt-10 font-bold">Report an issue, make a difference!</h2>
            <br />
            <p className="pb-10">
              Collaborate with other citizens and help make our city a better place.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <div className="relative flex justify-center items-center">
              <img src="/img/CTA-BG.jpg" className="cta-img" alt="City view" />
              <Link
                to="/map"
                className="cta-bottom absolute rounded border-2 border-black bg-gray-500 text-gray-200 hover:bg-gray-600 px-6 py-3 text-xl"
              >
                View Issue Map
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-10 px-4 pb-10">
          <div className="card border-solid border-black border-2 p-2">
            <div className="card-body text-center">
              <h5 className="card-title text-center text-3xl">Step 1</h5>
              <p className="card-text text-2xl">
                Create your account and start contributing to your community.
              </p>
            </div>
          </div>
          <div className="card border-solid border-black border-2 p-2">
            <div className="card-body text-center">
              <h5 className="card-title text-center text-3xl">Step 2</h5>
              <p className="card-text text-2xl">
                Find an issue in your neighborhood and select its location on the map.
              </p>
            </div>
          </div>
          <div className="card border-solid border-black border-2 p-2">
            <div className="card-body text-center">
              <h5 className="card-title text-center text-3xl">Step 3</h5>
              <p className="card-text text-2xl">
                Describe the issue and submit your report for the community to see.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
