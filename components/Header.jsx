export default function Header() {
  return (
    <div className="w-screen h-16 bg-blue-600 flex px-20 gap-x-2 items-center justify-between">
      <a href="/" className="w-32 h-20">
        <img src="logo.png" alt="Stroke Shield Logo" />
      </a>
      <div>
        <h1 className="font-bold text-xl text-white">Disclaimer: This app is not a medical tool</h1>
      </div>
    </div>
  );
}
