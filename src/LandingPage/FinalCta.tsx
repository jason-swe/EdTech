import { Link } from 'react-router-dom'

export function FinalCta() {
  return (
    <section className="bg-[#F3F4F6] px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-[2.1rem] font-black leading-[1.08] tracking-[-0.02em] text-[#003380] sm:text-[2.5rem] lg:text-[3.1rem]">
          Sẵn sàng kiến tạo tương lai học thuật của bạn?
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-[1rem] leading-[1.7] text-[#4B5563] sm:text-[1.1rem] lg:text-[1.25rem] lg:leading-[1.7]">
          Tham gia cùng các tổ chức có tư duy tiến bộ đang định nghĩa lại trình
          độ kỹ thuật số và sự thành công của sinh viên.
        </p>
        <Link
          to="/login"
          className="mt-10 inline-flex items-center justify-center rounded-[1.1rem] bg-[#032E78] px-9 py-3.5 text-[0.98rem] font-semibold text-white shadow-[0_14px_24px_rgba(3,46,120,0.2)] transition-all hover:bg-[#022964] hover:shadow-[0_16px_30px_rgba(3,46,120,0.26)] active:scale-[0.98] sm:px-12 sm:py-4 sm:text-[1.05rem]"
        >
          Đặt lịch demo cho tổ chức
        </Link>
      </div>
    </section>
  )
}
