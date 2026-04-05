export function OnlineHelpFab() {
  return (
    <a
      href="#"
      className="fixed bottom-4 right-4 z-50 inline-flex max-w-[calc(100vw-2rem)] items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[0.625rem] font-bold uppercase leading-tight tracking-wide text-[#6B7280] shadow-md transition-all hover:border-gray-300 hover:shadow-lg active:scale-[0.98]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#003399]">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
      <span className="pr-0.5">Trợ giúp trực tuyến</span>
    </a>
  )
}
