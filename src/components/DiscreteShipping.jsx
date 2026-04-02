export default function DiscreteShipping() {
  return (
    <section className="py-12 bg-[#111111] border-y border-white/5">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🤫</span>
          <div className="text-left">
            <h4 className="text-white font-bold text-lg">১০০% গোপনীয়তা</h4>
            <p className="text-gray-400 text-sm">প্যাকেটের গায়ে কোনো নাম থাকবে না</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-white/10"></div>
        <div className="flex items-center gap-4">
          <span className="text-4xl">🚀</span>
          <div className="text-left">
            <h4 className="text-white font-bold text-lg">সারা দেশে ডেলিভারি</h4>
            <p className="text-gray-400 text-sm">ঢাকার ভেতরে ২৪ ঘণ্টা, বাইরে ৪৮ ঘণ্টা</p>
          </div>
        </div>
      </div>
    </section>
  );
}