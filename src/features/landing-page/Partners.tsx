const partners = [
  'OXFORD.EDU',
  'STANFORD.AI',
  'MIT.LABS',
  'SORBONNE',
  'TSINGHUA',
] as const

export function Partners() {
  return (
    <section className="bg-[#F9FAFB] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4B5563]">
          Được tin dùng bởi các tổ chức học thuật hàng đầu
        </p>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-16 gap-y-10 md:gap-x-20">
          {partners.map((name) => (
            <span
              key={name}
              className="text-lg font-bold tracking-wide text-[#9CA3AF] opacity-70 grayscale"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
