import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import Loading from "@/components/loading";
import { useGlobalContext } from "@/context/store";
import { api } from "@/lib/api";

const ReportFormMap = lazy(() => import("@/components/report-form-map"));

export const Route = createFileRoute("/report-form")({
  component: ReportForm,
});

type Category = {
  id: string;
  name: string;
};

function ReportForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [idCat, setIdCat] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const { markerData } = useGlobalContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then((response) => {
      setCategories(response.data.data);
    });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (typeof markerData[0] !== "number" || typeof markerData[1] !== "number") {
      alert("Select a location on the map");
      return;
    }

    if (!title || !content || !street || !district || !idCat || !city) {
      alert("Fill in all fields");
      return;
    }

    api
      .post("/reports", {
        title,
        content,
        idCat,
        street,
        district,
        city,
        lat: markerData[0],
        lng: markerData[1],
      })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          navigate({ to: "/map" });
        } else {
          alert(response.data.message);
        }
      })
      .catch(() => {
        alert("Error while submitting report");
      });
  };

  return (
    <>
      <Header />
      <div className="grid grid-cols-2">
        <form className="flex justify-center items-center pt-36 pb-36" onSubmit={handleSubmit}>
          <div className="form-register grid grid-cols-2 gap-3 p-6 shadow-lg bg-slate-50 rounded-md">
            <h1 className="text-3xl block text-center font-semibold col-span-2">
              Issue Report Form
            </h1>
            <hr className="mt-3 col-span-2" />
            <div className="mt-3 col-span-2">
              <label htmlFor="title" className="block text-base mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Report title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mt-3 col-span-2">
              <label htmlFor="content" className="block text-base mb-2">
                Description
              </label>
              <input
                type="text"
                id="content"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Describe the issue..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="mt-3 col-span-2 grid grid-cols-12 gap-3">
              <div className="col-span-8">
                <label htmlFor="street" className="block text-base mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="street"
                  className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                  placeholder="Enter the address..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div className="col-span-4">
                <label htmlFor="category" className="block text-base mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                  value={idCat}
                  onChange={(e) => setIdCat(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="city" className="block text-base mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Enter the city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="district" className="block text-base mb-2">
                District
              </label>
              <input
                type="text"
                id="district"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Enter the district..."
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
            <div className="mt-3 flex justify-between items-center col-span-2">
              <div className="block text-base mb-2">
                <p>Select the issue location on the map</p>
              </div>
            </div>
            <div className="mt-5 col-span-2">
              <button
                type="submit"
                className="border-2 border-gray-900 bg-gray-900 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-900 font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <Suspense fallback={<Loading />}>
          <ReportFormMap />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
