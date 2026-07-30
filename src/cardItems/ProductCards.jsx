import { useBundle } from "../context/useBundle";

const formatMoney = (amount) => `$${amount.toFixed(2)}`;
const formatDiscount = (discount) => Number(discount.toFixed(2)).toString();

export default function ProductCards({ product }) {
  const { bundle, setCameraVariant, updateCameraQuantity } = useBundle();
  const selection = bundle.cameraSelections[product.id];
  const selectedVariant = product.variants?.find(
    (variant) => variant.id === selection.selectedVariantId,
  );
  const quantity = selection.quantities[selection.selectedVariantId] ?? 0;
  const image = selectedVariant?.image ?? product.image;
  const discount = bundle.discounts[product.id] ?? 0;
  const basePrice = product.compareAtPrice ?? product.price;
  const regularTotal = basePrice * quantity;
  const discountedTotal = regularTotal * (1 - discount / 100);

  return (
    <article className="relative flex min-h-[235px] w-full max-w-[520px] flex-col gap-3 overflow-hidden rounded-xl border-2 border-[#7B61FF] bg-white px-4 py-4 shadow-sm sm:min-h-[220px] sm:flex-row sm:gap-4">
      {discount > 0 && (
        <div className="absolute left-4 top-3 rounded-full bg-[#4E2FD2] px-3 py-1">
          <p className="text-xs font-semibold text-white">Save {formatDiscount(discount)}%</p>
        </div>
      )}

      <div className="flex h-28 shrink-0 items-center justify-center pt-4 sm:h-auto sm:w-[135px] sm:pt-8">
        {image && (
          <img
            src={image}
            alt={product.title}
            className="max-h-[110px] max-w-[125px] object-contain sm:max-h-[125px]"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="truncate text-xl font-semibold leading-6 text-[#222] sm:text-[22px]">
          {product.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#555] sm:text-[15px]">
          {product.description}
        </p>

        <a
          href={product.learnMoreUrl}
          onClick={(event) => event.preventDefault()}
          className="w-fit text-sm leading-5 text-[#0000EE] underline sm:text-base"
        >
          Learn More
        </a>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {product.variants?.map((variant) => (
            <button
              type="button"
              key={variant.id}
              aria-pressed={selectedVariant?.id === variant.id}
              onClick={() => setCameraVariant(product.id, variant.id)}
              className={`flex h-10 shrink-0 items-center gap-1 rounded border px-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E2FD2] ${
                selectedVariant?.id === variant.id
                  ? "border-[#4E2FD2] bg-[#EEEAFE] text-[#30208C]"
                  : "border-[#D9D9D9] text-[#484848] hover:border-[#4E2FD2] hover:bg-[#0AA2881A]"
              }`}
            >
              {variant.image && (
                <img
                  src={variant.image}
                  alt=""
                  className="size-6 object-contain"
                />
              )}

              <span className="whitespace-nowrap">{variant.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 sm:mt-auto">
          <div className="flex items-center gap-3" aria-label={`${product.title} quantity`}>
            <button
              type="button"
              aria-label={`Remove one ${product.title}`}
              disabled={quantity === 0}
              onClick={() => updateCameraQuantity(product.id, -1)}
              className="flex size-10 items-center justify-center rounded-md bg-[#EEF4F8] text-lg font-bold text-[#596674] transition hover:bg-[#DDE8F1] disabled:cursor-not-allowed disabled:text-[#9AA7B2]"
            >
              -
            </button>

            <span className="min-w-5 text-center text-xl text-[#222]">{quantity}</span>

            <button
              type="button"
              aria-label={`Add one ${product.title}`}
              onClick={() => updateCameraQuantity(product.id, 1)}
              className="flex size-10 items-center justify-center rounded-md bg-[#EEF4F8] text-lg font-bold text-[#596674] transition hover:bg-[#DDE8F1]"
            >
              +
            </button>
          </div>

          <div className="min-w-[120px] text-right leading-5">
            {/* <label className="mb-1 flex items-center justify-end gap-1 text-[11px] font-medium text-[#596674]">
              Discount
              <span className="flex h-7 items-center rounded border border-[#C9D3DF] bg-white px-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  inputMode="decimal"
                  aria-label={`${product.title} discount percentage`}
                  value={discount}
                  onChange={(event) => setCameraDiscount(product.id, event.target.value)}
                  className="w-10 bg-transparent text-right text-xs font-semibold text-[#3B22D1] outline-none"
                />
                <span className="text-xs text-[#596674]">%</span>
              </span>
            </label> */}

            {discount > 0 && (
              <p className="text-sm text-[#6B7280] line-through sm:text-base">{formatMoney(regularTotal)}</p>
            )}

            <p className="text-lg font-bold text-[#3B22D1] sm:text-xl">{formatMoney(discountedTotal)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
