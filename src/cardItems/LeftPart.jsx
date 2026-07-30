import CameraIcon from "../assets/icons/camera.svg";
import { ChevronDown } from "lucide-react";
import ProductCards from "./ProductCards";
import SecuritySteps from "./NextStep";
import { useBundle } from "../context/useBundle";

export default function Header() {
  const { products, restored, bundle, goToStep, toggleStep } = useBundle();
  const isOpen = bundle.openStep === "cameras";

  const openPlanStep = () => {
    goToStep("plan");
    requestAnimationFrame(() => {
      document.getElementById("builder-step-plan")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-white" id="builder-step-cameras">
      <div className="bg-[#EDF4FF]">
        {restored && (
          <p className="border-b border-[#C7D8F5] bg-[#E4F2FF] px-4 py-2 text-center text-xs font-medium text-[#24527A] sm:px-6">
            Your saved bundle has been restored.
          </p>
        )}
        <button
          type="button"
          onClick={() => toggleStep("cameras")}
          aria-expanded={isOpen}
          className="w-full px-4 py-5 text-left transition hover:bg-[#E5EFFD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#4E2FD2] sm:px-6 sm:py-6"
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-[#4B5563]">STEP 1 OF 4</p>
          <div className="mx-0 mt-4 h-px bg-[#B8C2D0]" />
          <div className="flex items-center justify-between gap-4 pt-5">
            <div className="flex items-center gap-3">
              <img src={CameraIcon} alt="" className="h-7 w-7" />
              <h1 className="text-2xl font-semibold tracking-tight text-[#151515] sm:text-3xl">
                Choose your cameras
              </h1>
            </div>
            <ChevronDown
              className={`size-6 shrink-0 text-[#4E2FD2] transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>
        {isOpen && (
          <>
            <div className="grid grid-cols-1 gap-4 bg-[#EEF6FF] p-4 sm:p-6 lg:grid-cols-2">
              {products.map((items, index) =>
                index === products.length - 1 && products.length % 2 !== 0 ? (
                  <div key={items.id} className="flex justify-center lg:col-span-2">
                    <ProductCards product={items} />
                  </div>
                ) : (
                  <ProductCards key={items.id} product={items} />
                ),
              )}
            </div>
            <div className="flex justify-center bg-[#EEF5FF] px-4 py-6 sm:px-6 sm:py-8">
              <button
                type="button"
                onClick={openPlanStep}
                className="min-h-11 w-full max-w-sm rounded-md border border-[#4E2FD2] px-5 py-2 text-sm font-semibold text-[#4E2FD2] transition hover:bg-[#4E2FD2] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E2FD2] sm:w-auto sm:px-8 sm:text-base"
              >
                Next: Choose your plan
              </button>
            </div>
          </>
        )}
      </div>
      <SecuritySteps />
    </section>
  );
}
