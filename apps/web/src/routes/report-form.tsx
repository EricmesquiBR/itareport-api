import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";

import { createReport } from "@/api/reports";
import { getCategories } from "@/api/categories";
import Loading from "@/components/loading";
import { useGlobalContext } from "@/context/store";

const ReportFormMap = lazy(() => import("@/components/report-form-map"));

export const Route = createFileRoute("/report-form")({
  component: ReportForm,
});

function ReportForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const { markerData } = useGlobalContext();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (typeof markerData[0] !== "number" || typeof markerData[1] !== "number") {
      setError("Select a location on the map");
      return;
    }

    if (!title || !content || !street || !district || !categoryId || !city) {
      setError("Fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await createReport({
        title,
        content,
        categoryId,
        street,
        district,
        city,
        lat: markerData[0],
        lng: markerData[1],
      });
      if (response.success) {
        navigate({ to: "/map" });
      } else {
        setError(response.message);
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? "Error while submitting report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2">
        <form className="flex justify-center items-center pt-36 pb-36" onSubmit={handleSubmit}>
          <div className="form-register grid grid-cols-2 gap-3 p-6 shadow-lg bg-slate-50 rounded-md">
            <h1 className="text-3xl block text-center font-semibold col-span-2">
              Issue Report Form
            </h1>
            <hr className="mt-3 col-span-2" />
            {error && (
              <div className="mt-3 col-span-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
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
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
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
                disabled={loading}
                className="border-2 border-gray-900 bg-gray-900 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
        <Suspense fallback={<Loading />}>
          <ReportFormMap />
        </Suspense>
    </div>
  );
}
