import { Check, ChevronDown, Grid3X3, Radar, ShieldCheck } from "lucide-react";
import CamUnlimitedBrand from "./CamUnlimitedBrand";
import { useBundle } from "../context/useBundle";

const icons = {
  plan: ShieldCheck,
  sensors: Radar,
  protection: Grid3X3,
};

const nextStepById = {
  plan: "sensors",
  sensors: "protection",
  protection: "cameras",
};

function OptionImage({ image, name }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#F4F7FB]">
      {image && <img src={image} alt={name} className="size-full object-contain" />}
    </div>
  );
}

function SensorChoiceCard({ option, quantity, onQuantityChange }) {
  const active = quantity > 0;

  return (
    <article
      className={`relative min-h-[142px] rounded-lg border bg-white p-4 transition ${
        active
          ? "border-[#4E2FD2] shadow-[0_0_0_2px_rgba(78,47,210,0.12)]"
          : "border-[#D9E1EC]"
      }`}
    >
      <div className="flex items-start gap-3">
        <OptionImage image={option.image} name={option.name} />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-[#151515]">{option.name}</h4>
          <p className="mt-1 text-xs leading-5 text-[#5B6470]">{option.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2" aria-label={`${option.name} quantity`}>
          <button
            type="button"
            aria-label={`Remove one ${option.name}`}
            disabled={quantity === 0}
            onClick={() => onQuantityChange(-1)}
            className="flex size-8 items-center justify-center rounded bg-[#EEF4F8] text-lg font-bold text-[#596674] transition hover:bg-[#DDE8F1] disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-5 text-center text-base font-medium text-[#222]">{quantity}</span>
          <button
            type="button"
            aria-label={`Add one ${option.name}`}
            onClick={() => onQuantityChange(1)}
            className="flex size-8 items-center justify-center rounded bg-[#EEF4F8] text-lg font-bold text-[#596674] transition hover:bg-[#DDE8F1]"
          >
            +
          </button>
        </div>
        <span className="text-sm font-bold text-[#3B22D1]">{option.price}</span>
      </div>
    </article>
  );
}

function PlanChoiceCard({ option, active, onToggle }) {
  const isCamUnlimited = option.id === "cam-unlimited";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`relative flex h-full min-h-[294px] flex-col overflow-hidden rounded-lg border bg-white text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E2FD2] ${
        active
          ? "border-[#4E2FD2] shadow-[0_0_0_2px_rgba(78,47,210,0.12)]"
          : "border-[#D9E1EC] hover:border-[#4E2FD2]"
      }`}
    >
      <div className="relative h-[116px] shrink-0">
        {isCamUnlimited ? (
          <CamUnlimitedBrand image={option.image} />
        ) : (
          <div className="flex h-full items-center gap-4 bg-[#F2FBF8] px-5">
            <OptionImage image={option.image} name={option.name} />
            <h4 className="text-lg font-bold leading-5 text-[#050505]">{option.name}</h4>
          </div>
        )}
        <span
          className={`absolute right-5 top-5 flex size-6 items-center justify-center rounded-md border ${
            active ? "border-[#4E2FD2] bg-[#4E2FD2]" : "border-[#C9D3DF] bg-white"
          }`}
        >
          {active && <Check className="size-4 text-white" strokeWidth={3} />}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-5 text-[#4D5968]">{option.description}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-6">
          {option.tag ? (
            <span className="rounded-full bg-[#EEEAFE] px-2.5 py-1 text-[10px] font-bold text-[#4E2FD2]">
              {option.tag}
            </span>
          ) : (
            <span />
          )}
          <span className="text-lg font-bold leading-none text-[#3B22D1]">{option.price}</span>
        </div>
      </div>
    </button>
  );
}

export default function SecuritySteps() {
  const {
    bundle,
    steps,
    selectOption,
    updateSensorQuantity,
    togglePlanOption,
    toggleStep,
    goToStep,
  } = useBundle();

  const moveToStep = (stepId) => {
    const nextStep = nextStepById[stepId];
    goToStep(nextStep);
    requestAnimationFrame(() => {
      document.getElementById(`builder-step-${nextStep}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="w-full border-t border-[#AEB4BD]">
      {steps.map((item) => {
        const Icon = icons[item.id];
        const isOpen = bundle.openStep === item.id;
        const nextStep = nextStepById[item.id];

        return (
          <section key={item.id} id={`builder-step-${item.id}`} className="scroll-mt-5 border-b border-[#AEB4BD]">
            <button
              type="button"
              onClick={() => toggleStep(item.id)}
              aria-expanded={isOpen}
              className="w-full bg-white px-4 py-5 text-left transition hover:bg-[#FAFCFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#4E2FD2] sm:px-6"
            >
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#5F6874]">
                {item.step}
              </p>

              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Icon className="size-6 shrink-0 text-[#7B8794]" strokeWidth={1.6} />
                  <h3 className="text-lg font-bold leading-tight text-[#151515] sm:text-[21px]">
                    {item.title}
                  </h3>
                </div>

                <ChevronDown
                  className={`size-5 shrink-0 text-[#4E2FD2] transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="bg-[#F7FAFF] px-4 pb-5 sm:px-6 sm:pb-6">
                <div className={`grid grid-cols-1 gap-3 ${item.id === "plan" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                  {item.options.map((option) => {
                    if (item.id === "sensors") {
                      return (
                        <SensorChoiceCard
                          key={option.id}
                          option={option}
                          quantity={bundle.sensorQuantities[option.id] ?? 0}
                          onQuantityChange={(change) => updateSensorQuantity(option.id, change)}
                        />
                      );
                    }

                    if (item.id === "plan") {
                      return (
                        <PlanChoiceCard
                          key={option.id}
                          option={option}
                          active={bundle.planSelections[option.id] > 0}
                          onToggle={() => togglePlanOption(option.id)}
                        />
                      );
                    }

                    const active = bundle.selectedOptions[item.id] === option.id;

                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => selectOption(item.id, option.id)}
                        aria-pressed={active}
                        className={`relative min-h-[142px] rounded-lg border bg-white p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E2FD2] ${
                          active
                            ? "border-[#4E2FD2] shadow-[0_0_0_2px_rgba(78,47,210,0.12)]"
                            : "border-[#D9E1EC] hover:border-[#4E2FD2]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-3">
                            <OptionImage image={option.image} name={option.name} />
                            <div>
                              <h4 className="text-sm font-bold text-[#151515]">{option.name}</h4>
                              <p className="mt-1 text-xs leading-5 text-[#5B6470]">{option.description}</p>
                            </div>
                          </div>

                          <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                              active ? "border-[#4E2FD2] bg-[#4E2FD2]" : "border-[#C9D3DF]"
                            }`}
                          >
                            {active && <Check className="size-3 text-white" strokeWidth={3} />}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          {option.tag ? (
                            <span className="rounded-full bg-[#EEEAFE] px-2 py-1 text-[10px] font-bold text-[#4E2FD2]">
                              {option.tag}
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className="text-sm font-bold text-[#3B22D1]">{option.price}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => moveToStep(item.id)}
                    className="min-h-11 w-full rounded-md bg-[#4E2FD2] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#3E24B4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E2FD2] sm:w-auto"
                  >
                    {nextStep === "cameras" ? "Review your system" : `Next: Choose your ${nextStep}`}
                  </button>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
