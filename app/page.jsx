import Head from "next/head";

export default function Home() {
  return (
    <div className="flex text-center items-center justify-center w-screen h-[calc(100vh-64px)]">
      <div className="w-[500px] flex flex-col items-center justify-center h-[500px] shadow-neutral-400 shadow-lg">
        <h1 className="text-6xl pb-2">Welcome to StrokeShield</h1>
        <p className="text-gray-800 mb-6">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia
          eius non est eum, beatae iusto quos ullam iure voluptatibus animi,
          quasi sed, maxime quas. Nisi laboriosam nesciunt repudiandae quibusdam
          reiciendis.
        </p>
        <div>
          <a
            href="/face-scan"
            className="m-4 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Start Test
          </a>
          <a
            href="/"
            className="m-4 bg-gray-500 text-white p-3 rounded hover:bg-gray-700 transition cursor-pointer"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
