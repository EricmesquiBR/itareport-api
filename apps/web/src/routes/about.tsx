import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="text-center py-16 px-8">
      <h1 className="text-4xl font-bold mb-8">About ItaReport</h1>
      <p className="text-xl max-w-2xl mx-auto mb-12">
        ItaReport is a community-driven platform where citizens can report urban issues such as
        structural problems, car accidents, lack of accessibility, or environmental damage —
        helping improve the city of Itapaje collectively.
      </p>
      <h2 className="text-3xl font-bold mb-8">Our Team</h2>
      <div className="flex justify-center gap-12 flex-wrap">
        <div className="text-center w-64">
          <img
            src="/about/eric.jpeg"
            alt="Eric Mesquita"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
          <h3 className="text-xl font-semibold">Eric Mesquita</h3>
          <p className="text-gray-600">Developer</p>
        </div>
        <div className="text-center w-64">
          <img
            src="/about/lucas.jpeg"
            alt="Lucas Melo"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
          <h3 className="text-xl font-semibold">Lucas Melo</h3>
          <p className="text-gray-600">Developer</p>
        </div>
        <div className="text-center w-64">
          <img
            src="/about/matheus.png"
            alt="Matheus Rabelo"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
          <h3 className="text-xl font-semibold">Matheus Rabelo</h3>
          <p className="text-gray-600">Developer</p>
        </div>
      </div>
    </div>
  );
}
