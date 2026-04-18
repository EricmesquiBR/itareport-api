import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";

import { createReport } from "@/api/reports";
import { getCategories, type Category } from "@/api/categories";
import Loading from "@/components/loading";
import { useGlobalContext } from "@/context/store";
import { isInsideCentro } from "@/lib/geofencing";
import { useSession } from "@/lib/auth-client";

const ReportFormMap = lazy(() => import("@/components/report-form-map"));

export const Route = createFileRoute("/report-form")({
  component: ReportForm,
});

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function ReportForm() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { markerData, setMarkerData } = useGlobalContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { data: session, isPending: sessionPending } = useSession();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!sessionPending && !session?.user) {
      navigate({ to: "/login" });
    }
  }, [session, sessionPending, navigate]);

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImage(null);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("A imagem deve ter no máximo 10MB");
      return;
    }
    setError("");
    setImage(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Informe um título");
      return;
    }
    if (!categoryId) {
      setError("Selecione uma categoria");
      return;
    }
    if (typeof markerData[0] !== "number" || typeof markerData[1] !== "number") {
      setError("Selecione a localização no mapa");
      return;
    }
    if (!isInsideCentro(markerData[0], markerData[1])) {
      setError("A localização deve estar dentro do Centro de Itapajé");
      return;
    }
    if (!image) {
      setError("A foto é obrigatória");
      return;
    }

    setLoading(true);
    try {
      await createReport({
        title: title.trim(),
        categoryId,
        lat: markerData[0],
        lng: markerData[1],
        image,
      });
      setMarkerData(["", ""]);
      navigate({ to: "/map" });
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 429) {
        setError("Muitos reportes em pouco tempo. Aguarde alguns minutos.");
      } else {
        setError(axiosError.response?.data?.message ?? "Erro ao enviar reporte");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      <form
        className="flex justify-center items-start pt-10 pb-10 px-4"
        onSubmit={handleSubmit}
      >
        <div className="form-register grid grid-cols-1 gap-3 p-6 shadow-lg bg-slate-50 rounded-md w-full">
          <h1 className="text-3xl block text-center font-semibold">
            Reportar um problema
          </h1>
          <hr />
          {error && (
            <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-base mb-2">
              Título
            </label>
            <input
              type="text"
              id="title"
              required
              maxLength={120}
              className="border w-full text-base px-2 py-1 focus:outline-none focus:border-gray-600"
              placeholder="Ex: Buraco na Rua X"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-base mb-2">
              Categoria
            </label>
            <select
              id="category"
              required
              className="border w-full text-base px-2 py-1 focus:outline-none focus:border-gray-600"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block text-base mb-2">
              Foto <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              capture="environment"
              required
              className="border w-full text-base px-2 py-1"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Prévia"
                className="mt-2 max-h-48 rounded object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Clique no mapa para marcar o local exato. A área válida é o
              Centro de Itapajé (destacada em verde).
            </p>
            {typeof markerData[0] === "number" &&
              typeof markerData[1] === "number" && (
                <p className="text-sm text-gray-800 mt-1">
                  Local: {markerData[0].toFixed(5)}, {markerData[1].toFixed(5)}
                </p>
              )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-3 border-2 border-gray-900 bg-gray-900 text-white py-2 w-full rounded-md hover:bg-transparent hover:text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar reporte"}
          </button>
        </div>
      </form>
      <Suspense fallback={<Loading />}>
        <ReportFormMap />
      </Suspense>
    </div>
  );
}
