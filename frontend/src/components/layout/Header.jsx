const Header = ({
  search,
  setSearch,
  showProfile,
  setShowProfile,
  user,
  handleLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f14]/95 backdrop-blur m-auto ">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile logo */}
        <div className="flex items-center lg:hidden">
          <span className="font-bold text-white">
            Focus<span className="text-orange-500">Note</span>
          </span>
        </div>

        {/* Search */}
        <div className="relative left-10 mx-auto w-full max-w-2xl lg:mx-0">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-xl border border-white/10 bg-[#151b23] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#f5a623]/60 focus:ring-2 focus:ring-[#f5a623]/10"
          />
        </div>

        {/* Profile */}
        <div
          className="relative ml-auto flex items-center gap-3"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          <button
            type="button"
            onClick={() => setShowProfile((current) => !current)}
            aria-expanded={showProfile}
            aria-haspopup="menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-semibold text-white transition hover:scale-105"
          >
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </button>

          {showProfile && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-white/10 bg-[#171d25] p-2 shadow-2xl">
              <div className="border-b border-white/10 px-3 py-3">
                <p className="text-sm font-medium text-white">
                  {user?.full_name || "User"}
                </p>

                <p className="mt-1 truncate text-xs text-gray-500">
                  {user?.email || ""}
                </p>
              </div>

              <button className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5">
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-400 hover:bg-red-400/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
