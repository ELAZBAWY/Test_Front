import { RotateCcw } from "lucide-react";
import CamUnlimitedBrand from "../cardItems/CamUnlimitedBrand";
import { useBundle } from "../context/useBundle";

const formatMoney = (amount) => `$${amount.toFixed(2)}`;

function ImageSlot({ image, alt, className = "" }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}>
      {image && <img src={image} alt={alt} className="size-full object-contain" />}
    </div>
  );
}

function ProductRow({ item, onQuantityChange }) {
  const linePrice = item.price * item.quantity;
  const lineOldPrice = item.oldPrice ? item.oldPrice * item.quantity : null;

  return (
    <div className="flex items-center gap-2 py-3">
      <ImageSlot image={item.image} alt={item.name} className="size-10 rounded-md bg-white" />
      <p className="min-w-0 flex-1 text-xs leading-4 text-[#111827]">{item.name}</p>

      <div className="flex shrink-0 items-center gap-1" aria-label={`${item.name} quantity`}>
        <button
          type="button"
          aria-label={`Remove one ${item.name}`}
          disabled={item.quantity === 0}
          onClick={() => onQuantityChange(-1)}
          className="flex size-7 items-center justify-center rounded bg-white text-base leading-none text-[#4B5563] transition hover:bg-[#DFEAF8] disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span className="min-w-4 text-center text-xs font-medium text-[#111827]">{item.quantity}</span>
        <button
          type="button"
          aria-label={`Add one ${item.name}`}
          onClick={() => onQuantityChange(1)}
          className="flex size-7 items-center justify-center rounded bg-white text-base leading-none text-[#4B5563] transition hover:bg-[#DFEAF8]"
        >
          +
        </button>
      </div>

      <div className="w-14 shrink-0 text-right">
        {lineOldPrice && (
          <p className="text-[10px] leading-3 text-[#6B7280] line-through">{formatMoney(lineOldPrice)}</p>
        )}
        <p className="text-xs font-bold leading-4 text-[#3B22D1]">{formatMoney(linePrice)}</p>
      </div>
    </div>
  );
}

function SelectedDeviceRow({ option, label }) {
  if (!option) return null;

  return (
    <div className="flex items-center gap-2 py-3">
      <ImageSlot image={option.image} alt={option.name} className="size-10 rounded-md bg-white" />
      <div className="min-w-0 flex-1">
        {label && <p className="text-[10px] uppercase tracking-wide text-[#7B8794]">{label}</p>}
        <p className="text-xs leading-4 text-[#111827]">{option.name}</p>
      </div>
      <p className="shrink-0 text-xs font-bold text-[#3B22D1]">
        {option.amount === 0 ? "Included" : option.price}
      </p>
    </div>
  );
}

function PlanRow({ plan }) {
  if (!plan) return null;

  const isCamUnlimited = plan.id === "cam-unlimited";

  return (
    <div className="flex items-center gap-3 py-3">
      {isCamUnlimited ? (
        <CamUnlimitedBrand image={plan.image} compact />
      ) : (
        <>
          <ImageSlot image={plan.image} alt={plan.name} className="size-11 rounded-md bg-white" />
          <p className="min-w-0 flex-1 text-base font-semibold leading-5 text-[#111827]">{plan.name}</p>
        </>
      )}
      <div className="shrink-0 text-right leading-4">
        {plan.compareMonthlyPrice > plan.monthlyPrice && (
          <p className="text-xs text-[#6B7280] line-through">
            {formatMoney(plan.compareMonthlyPrice)}/mo
          </p>
        )}
        <p className="text-base font-bold text-[#3B22D1]">
          {plan.monthlyPrice > 0 ? `${formatMoney(plan.monthlyPrice)}/mo` : "Free"}
        </p>
      </div>
    </div>
  );
}

function ShippingRow({ option }) {
  if (!option) return null;

  return (
    <div className="flex items-center gap-3 py-4">
      <ImageSlot image={option.image} alt={option.name} className="size-12 rounded-md bg-white" />
      <p className="min-w-0 flex-1 text-base leading-5 text-[#111827]">{option.name}</p>
      <div className="shrink-0 text-right leading-4">
        {option.compareAmount > option.amount && (
          <p className="text-xs text-[#6B7280] line-through">{formatMoney(option.compareAmount)}</p>
        )}
        <p className="text-sm font-bold text-[#3B22D1]">
          {option.amount === 0 ? "FREE" : option.price}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="border-t border-[#D4DDEA] pt-2">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#7B8794]">{title}</p>
      {children}
    </section>
  );
}

export default function SecurityReviewCard() {
  const {
    selectedCameras,
    selectedSensors,
    selectedPlans,
    selections,
    securitySystem,
    total,
    compareTotal,
    savings,
    itemCount,
    savedFeedback,
    updateCameraQuantity,
    updateSensorQuantity,
    saveBundle,
    resetBundle,
  } = useBundle();
  const installmentCount = securitySystem?.installmentCount || 1;
  const installmentPrice = total / installmentCount;

  return (
    <section className="w-full overflow-hidden rounded-xl bg-[#EEF5FF] px-4 py-5 font-sans shadow-sm sm:px-5" aria-label="Your security system">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4B5563]">Review</p>
        <button
          type="button"
          onClick={resetBundle}
          className="inline-flex min-h-8 items-center gap-1 rounded px-1 text-xs font-medium text-[#4E2FD2] underline-offset-2 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4E2FD2]"
        >
          <RotateCcw className="size-3.5" /> Reset
        </button>
      </div>

      <h2 className="mb-1 text-xl font-bold text-[#111827]">Your security system</h2>
      <p className="mb-4 text-xs leading-5 text-[#4B5563]">
        Your selections update here automatically and are saved for your next visit.
      </p>

      <Section title={`Cameras${itemCount ? ` · ${itemCount}` : ""}`}>
        {selectedCameras.length ? (
          selectedCameras.map((item) => (
            <ProductRow
              key={item.id}
              item={item}
              onQuantityChange={(change) => updateCameraQuantity(item.productId, change, item.variantId)}
            />
          ))
        ) : (
          <p className="py-3 text-xs leading-5 text-[#5B6470]">Add a camera to start building your system.</p>
        )}
      </Section>

      <Section
        title={`Sensors${selectedSensors.length ? ` · ${selectedSensors.reduce((sum, sensor) => sum + sensor.quantity, 0)}` : ""}`}
      >
        {selectedSensors.length ? (
          selectedSensors.map((sensor) => (
            <ProductRow
              key={sensor.id}
              item={sensor}
              onQuantityChange={(change) => updateSensorQuantity(sensor.id, change)}
            />
          ))
        ) : (
          <p className="py-3 text-xs leading-5 text-[#5B6470]">Add sensors to protect more areas.</p>
        )}
      </Section>

      <Section title="Extra protection">
        <SelectedDeviceRow option={selections.protection} />
      </Section>

      <section className="mt-2 border-t border-[#D4DDEA] pt-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-[#7B8794]">Plan</p>
        {selectedPlans.length ? (
          selectedPlans.map((plan) =>
            plan.id === "fast-shipping" ? (
              <ShippingRow key={plan.id} option={plan} />
            ) : (
              <PlanRow key={plan.id} plan={plan} />
            ),
          )
        ) : (
          <p className="py-3 text-xs leading-5 text-[#5B6470]">Choose a plan to complete your system.</p>
        )}
      </section>

      <div className="flex items-center gap-3 border-t border-[#D4DDEA] py-4">
        <ImageSlot
          image= "/images/pro.png"
          alt="Savings badge"
          className="size-20 rounded-full"
        />
        <div className="min-w-0 flex-1 text-right">
          <p className="inline-block rounded bg-[#4E2FD2] px-2 py-1 text-xs font-medium text-white">
            as low as {formatMoney(installmentPrice)}/mo
          </p>
          <div className="mt-2 flex items-baseline justify-end gap-2">
            {compareTotal > total && (
              <p className="text-lg text-[#6B7280] line-through">{formatMoney(compareTotal)}</p>
            )}
            <p className="text-3xl font-bold leading-none text-[#3B22D1]">{formatMoney(total)}</p>
          </div>
        </div>
      </div>

      {savings > 0 && (
        <p className="mb-3 text-center text-sm font-medium text-[#00A88E]">
          Congrats! You&apos;re saving {formatMoney(savings)} on your security bundle!
        </p>
      )}

      <button
        type="button"
        onClick={saveBundle}
        className="min-h-14 w-full rounded-md bg-[#4E2FD2] px-4 py-2 text-xl font-bold text-white transition hover:bg-[#3E24B4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E2FD2]"
      >
        Checkout
      </button>

      <button
        type="button"
        onClick={saveBundle}
        className="mt-3 block w-full text-center text-sm italic text-[#4B5563] underline underline-offset-2 transition hover:text-[#3B22D1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4E2FD2]"
      >
        Save my system for later
      </button>

      {savedFeedback && (
        <p className="mt-3 text-center text-xs font-medium text-[#087A4B]" role="status">
          Your system has been saved on this device.
        </p>
      )}
    </section>
  );
}
