export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4f0f0] px-10 py-3">
      <div className="flex items-center pl-10 text-[#181111]">
        <a href="/" className="w-fit h-10 flex items-center justify-center">
          <img
            src="logo.png"
            alt="StrokeShield Logo"
            className="h-full object-contain"
          />
          <h2 className="text-[#181111] text-lg font-bold">StrokeShield</h2>
        </a>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <a
            className="text-[#181111] text-sm font-medium leading-normal"
            href="#"
          >
            Login
          </a>
        </div>
        <a
          href="/face-scan"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e61919] text-white text-sm font-bold hover:bg-red-500 transition"
        >
          <span className="truncate">Sign Up</span>
        </a>
      </div>
    </header>
  );
}
