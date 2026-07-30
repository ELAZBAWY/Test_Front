import Header from "../cardItems/LeftPart";
import SecurityReviewCard from "../secutritySystem/SecuritySystem";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FBFF] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-7">
        <div className="min-w-0 rounded-2xl shadow-sm">
          <Header />
        </div>
        <aside className="w-full xl:sticky xl:top-6">
          <SecurityReviewCard />
        </aside>
      </div>
    </main>
  );
}
