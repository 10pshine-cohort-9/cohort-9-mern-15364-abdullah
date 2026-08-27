const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171d25] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-400">
              Account profile
            </p>
            <h2
              id="profile-modal-title"
              className="mt-2 text-2xl font-semibold text-white"
            >
              {user.full_name || "User"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xl leading-none text-gray-400 hover:bg-white/5 hover:text-white"
            aria-label="Close profile"
          >
            x
          </button>
        </div>

        <dl className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0d1218]">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <dt className="text-sm text-gray-500">Full name</dt>
            <dd className="text-right text-sm font-medium text-gray-200">
              {user.full_name || "Not available"}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="max-w-[65%] truncate text-right text-sm font-medium text-gray-200">
              {user.email || "Not available"}
            </dd>
          </div>

        </dl>
      </div>
    </div>
  );
};

export default ProfileModal;
