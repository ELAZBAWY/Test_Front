import { useCallback, useEffect, useMemo, useState } from "react";
import bundleData from "../data/bundleData.json";
import { BUNDLE_STEPS, STEP_ORDER } from "../data/bundleOptions";
import BundleContext from "./BundleContextObject";
const STORAGE_KEY = "wyze-security-bundle:v1";
const SINGLE_SELECT_STEP_IDS = ["protection"];

const getVariants = (product) => product.variants ?? [{ id: "default", label: "" }];

const getBasePrice = (product) => product.compareAtPrice ?? product.price;

const getDefaultDiscount = (product) => {
  if (!product.compareAtPrice) return 0;

  return Number((((product.compareAtPrice - product.price) / product.compareAtPrice) * 100).toFixed(2));
};

function createDefaultBundle() {
  const cameraSelections = Object.fromEntries(
    bundleData.Products.map((product) => {
      const variants = getVariants(product);
      const seed = product.seed ?? {};
      const seededVariant = variants.find((variant) => seed[variant.id] > 0);

      return [
        product.id,
        {
          selectedVariantId: seededVariant?.id ?? variants[0].id,
          quantities: Object.fromEntries(
            variants.map((variant) => [variant.id, Math.max(0, Number(seed[variant.id]) || 0)]),
          ),
        },
      ];
    }),
  );

  return {
    cameraSelections,
    sensorQuantities: Object.fromEntries(
      BUNDLE_STEPS.find((step) => step.id === "sensors").options.map((option) => [
        option.id,
        Math.max(0, Number(option.seed) || 0),
      ]),
    ),
    planSelections: Object.fromEntries(
      BUNDLE_STEPS.find((step) => step.id === "plan").options.map((option) => [
        option.id,
        Math.max(0, Number(option.seed) || 0),
      ]),
    ),
    discounts: Object.fromEntries(
      bundleData.Products.map((product) => [product.id, getDefaultDiscount(product)]),
    ),
    selectedOptions: {
      protection: "",
    },
    openStep: "cameras",
  };
}

function normalizeBundle(savedBundle) {
  const defaults = createDefaultBundle();

  if (!savedBundle || typeof savedBundle !== "object") {
    return defaults;
  }

  const cameraSelections = Object.fromEntries(
    bundleData.Products.map((product) => {
      const variants = getVariants(product);
      const savedSelection = savedBundle.cameraSelections?.[product.id];
      const validVariantIds = variants.map((variant) => variant.id);
      const selectedVariantId = validVariantIds.includes(savedSelection?.selectedVariantId)
        ? savedSelection.selectedVariantId
        : defaults.cameraSelections[product.id].selectedVariantId;

      return [
        product.id,
        {
          selectedVariantId,
          quantities: Object.fromEntries(
            variants.map((variant) => {
              const quantity = Number(savedSelection?.quantities?.[variant.id]);
              return [
                variant.id,
                Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0,
              ];
            }),
          ),
        },
      ];
    }),
  );

  const selectedOptions = Object.fromEntries(
    BUNDLE_STEPS.filter((step) => SINGLE_SELECT_STEP_IDS.includes(step.id)).map((step) => {
      const savedOptionId = savedBundle.selectedOptions?.[step.id];
      const isValidOption = step.options.some((option) => option.id === savedOptionId);
      return [step.id, isValidOption ? savedOptionId : defaults.selectedOptions[step.id]];
    }),
  );

  const sensorStep = BUNDLE_STEPS.find((step) => step.id === "sensors");
  const sensorQuantities = Object.fromEntries(
    sensorStep.options.map((option) => {
      const savedQuantity = Number(savedBundle.sensorQuantities?.[option.id]);
      const legacySelectedSensor = savedBundle.selectedOptions?.sensors === option.id;
      const defaultQuantity = defaults.sensorQuantities[option.id];

      return [
        option.id,
        Number.isFinite(savedQuantity)
          ? Math.max(0, Math.floor(savedQuantity))
          : legacySelectedSensor
            ? Math.max(1, defaultQuantity)
            : defaultQuantity,
      ];
    }),
  );

  const planStep = BUNDLE_STEPS.find((step) => step.id === "plan");
  const planSelections = Object.fromEntries(
    planStep.options.map((option) => {
      const savedSelection = Number(savedBundle.planSelections?.[option.id]);
      const wasPreviouslySelectedPlan = savedBundle.selectedOptions?.plan === option.id;
      const wasPreviouslySelectedShipping =
        option.id === "fast-shipping" && savedBundle.selectedOptions?.protection === "fast-shipping";
      const defaultSelection = defaults.planSelections[option.id];

      return [
        option.id,
        Number.isFinite(savedSelection)
          ? Math.min(1, Math.max(0, Math.floor(savedSelection)))
          : wasPreviouslySelectedPlan || wasPreviouslySelectedShipping
            ? 1
            : defaultSelection,
      ];
    }),
  );

  const discounts = Object.fromEntries(
    bundleData.Products.map((product) => {
      const savedDiscount = Number(savedBundle.discounts?.[product.id]);
      const isValidDiscount = Number.isFinite(savedDiscount) && savedDiscount >= 0 && savedDiscount <= 100;

      return [product.id, isValidDiscount ? savedDiscount : defaults.discounts[product.id]];
    }),
  );

  return {
    cameraSelections,
    sensorQuantities,
    planSelections,
    discounts,
    selectedOptions,
    openStep: STEP_ORDER.includes(savedBundle.openStep)
      ? savedBundle.openStep
      : defaults.openStep,
  };
}

function loadBundle() {
  try {
    const savedBundle = window.localStorage.getItem(STORAGE_KEY);

    if (!savedBundle) {
      return { bundle: createDefaultBundle(), restored: false };
    }

    return { bundle: normalizeBundle(JSON.parse(savedBundle)), restored: true };
  } catch {
    return { bundle: createDefaultBundle(), restored: false };
  }
}

function findOption(stepId, optionId) {
  return BUNDLE_STEPS.find((step) => step.id === stepId)?.options.find(
    (option) => option.id === optionId,
  );
}

export function BundleProvider({ children }) {
  const [{ bundle: initialBundle, restored }] = useState(loadBundle);
  const [bundle, setBundle] = useState(initialBundle);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
    } catch {
      // Browsing can continue normally when storage is unavailable.
    }
  }, [bundle]);

  const setCameraVariant = useCallback((productId, variantId) => {
    setBundle((currentBundle) => ({
      ...currentBundle,
      cameraSelections: {
        ...currentBundle.cameraSelections,
        [productId]: {
          ...currentBundle.cameraSelections[productId],
          selectedVariantId: variantId,
        },
      },
    }));
  }, []);

  const updateCameraQuantity = useCallback((productId, change, explicitVariantId) => {
    setBundle((currentBundle) => {
      const selection = currentBundle.cameraSelections[productId];
      const variantId = explicitVariantId ?? selection.selectedVariantId;
      const currentQuantity = selection.quantities[variantId] ?? 0;

      return {
        ...currentBundle,
        cameraSelections: {
          ...currentBundle.cameraSelections,
          [productId]: {
            ...selection,
            quantities: {
              ...selection.quantities,
              [variantId]: Math.max(0, currentQuantity + change),
            },
          },
        },
      };
    });
  }, []);

  const setCameraDiscount = useCallback((productId, value) => {
    const inputDiscount = Number(value);
    const discount = Number.isFinite(inputDiscount)
      ? Math.min(100, Math.max(0, inputDiscount))
      : 0;

    setBundle((currentBundle) => ({
      ...currentBundle,
      discounts: {
        ...currentBundle.discounts,
        [productId]: discount,
      },
    }));
  }, []);

  const selectOption = useCallback((stepId, optionId) => {
    if (!SINGLE_SELECT_STEP_IDS.includes(stepId)) return;

    setBundle((currentBundle) => ({
      ...currentBundle,
      selectedOptions: {
        ...currentBundle.selectedOptions,
        [stepId]: optionId,
      },
    }));
  }, []);

  const updateSensorQuantity = useCallback((sensorId, change) => {
    setBundle((currentBundle) => {
      const currentQuantity = currentBundle.sensorQuantities[sensorId] ?? 0;

      return {
        ...currentBundle,
        sensorQuantities: {
          ...currentBundle.sensorQuantities,
          [sensorId]: Math.max(0, currentQuantity + change),
        },
      };
    });
  }, []);

  const togglePlanOption = useCallback((optionId) => {
    const planStep = BUNDLE_STEPS.find((step) => step.id === "plan");
    const option = planStep.options.find((item) => item.id === optionId);

    if (!option) return;

    setBundle((currentBundle) => {
      const isSelected = Boolean(currentBundle.planSelections[optionId]);
      const planSelections = Object.fromEntries(
        planStep.options.map((item) => {
          if (option.selectionGroup === "subscription") {
            return [
              item.id,
              item.selectionGroup === "subscription"
                ? Number(item.id === optionId && !isSelected)
                : currentBundle.planSelections[item.id] ?? 0,
            ];
          }

          return [
            item.id,
            item.id === optionId ? (isSelected ? 0 : 1) : currentBundle.planSelections[item.id] ?? 0,
          ];
        }),
      );

      return {
        ...currentBundle,
        planSelections,
      };
    });
  }, []);

  const toggleStep = useCallback((stepId) => {
    setBundle((currentBundle) => ({
      ...currentBundle,
      openStep: currentBundle.openStep === stepId ? "" : stepId,
    }));
  }, []);

  const goToStep = useCallback((stepId) => {
    if (!STEP_ORDER.includes(stepId)) return;

    setBundle((currentBundle) => ({
      ...currentBundle,
      openStep: stepId,
    }));
  }, []);

  const saveBundle = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
      setSavedFeedback(true);
    } catch {
      setSavedFeedback(false);
    }
  }, [bundle]);

  const resetBundle = useCallback(() => {
    setBundle(createDefaultBundle());
    setSavedFeedback(false);
  }, []);

  const derivedBundle = useMemo(() => {
    const selectedCameras = bundleData.Products.flatMap((product) => {
      const selection = bundle.cameraSelections[product.id];
      const basePrice = getBasePrice(product);
      const discount = bundle.discounts[product.id] ?? 0;
      const discountedPrice = basePrice * (1 - discount / 100);

      return getVariants(product)
        .map((variant) => ({
          product,
          variant,
          quantity: selection?.quantities?.[variant.id] ?? 0,
        }))
        .filter((item) => item.quantity > 0)
        .map(({ product: camera, variant, quantity }) => ({
          id: `${camera.id}-${variant.id}`,
          productId: camera.id,
          variantId: variant.id,
          name: variant.label ? `${camera.title} · ${variant.label}` : camera.title,
          image: variant.image ?? camera.image,
          quantity,
          price: discountedPrice,
          oldPrice: discount > 0 ? basePrice : null,
          discount,
        }));
    });

    const selections = Object.fromEntries(
      BUNDLE_STEPS.filter((step) => SINGLE_SELECT_STEP_IDS.includes(step.id)).map((step) => [
        step.id,
        findOption(step.id, bundle.selectedOptions[step.id]),
      ]),
    );
    const selectedPlans = BUNDLE_STEPS.find((step) => step.id === "plan").options.filter(
      (plan) => bundle.planSelections[plan.id] > 0,
    );
    const selectedSensors = BUNDLE_STEPS.find((step) => step.id === "sensors").options
      .map((sensor) => ({
        ...sensor,
        quantity: bundle.sensorQuantities[sensor.id] ?? 0,
        price: sensor.amount,
        oldPrice: sensor.compareAmount ?? null,
      }))
      .filter((sensor) => sensor.quantity > 0);
    const selectedProtection = selections.protection;
    const cameraTotal = selectedCameras.reduce((total, item) => total + item.price * item.quantity, 0);
    const cameraCompareTotal = selectedCameras.reduce(
      (total, item) => total + (item.oldPrice ?? item.price) * item.quantity,
      0,
    );
    const sensorTotal = selectedSensors.reduce(
      (sum, sensor) => sum + sensor.price * sensor.quantity,
      0,
    );
    const sensorCompareTotal = selectedSensors.reduce(
      (sum, sensor) => sum + (sensor.oldPrice ?? sensor.price) * sensor.quantity,
      0,
    );
    const planExtraTotal = selectedPlans.reduce((sum, plan) => sum + (plan.amount ?? 0), 0);
    const planExtraCompareTotal = selectedPlans.reduce(
      (sum, plan) => sum + (plan.compareAmount ?? plan.amount ?? 0),
      0,
    );
    const extrasTotal = sensorTotal + (selectedProtection?.amount ?? 0) + planExtraTotal;
    const extrasCompareTotal =
      sensorCompareTotal +
      (selectedProtection?.compareAmount ?? selectedProtection?.amount ?? 0) +
      planExtraCompareTotal;
    const total = cameraTotal + extrasTotal;

    return {
      selectedCameras,
      selectedSensors,
      selectedPlans,
      selections,
      monthlyPlanTotal: selectedPlans.reduce((sum, plan) => sum + (plan.monthlyPrice ?? 0), 0),
      total,
      compareTotal: cameraCompareTotal + extrasCompareTotal,
      savings: Math.max(0, cameraCompareTotal + extrasCompareTotal - total),
      itemCount: selectedCameras.reduce((totalItems, item) => totalItems + item.quantity, 0),
    };
  }, [
    bundle.cameraSelections,
    bundle.discounts,
    bundle.planSelections,
    bundle.selectedOptions,
    bundle.sensorQuantities,
  ]);

  const value = useMemo(
    () => ({
      products: bundleData.Products,
      securitySystem: bundleData.securitySystem,
      steps: BUNDLE_STEPS,
      bundle,
      restored,
      savedFeedback,
      ...derivedBundle,
      setCameraVariant,
      updateCameraQuantity,
      setCameraDiscount,
      selectOption,
      updateSensorQuantity,
      togglePlanOption,
      toggleStep,
      goToStep,
      saveBundle,
      resetBundle,
    }),
    [
      bundle,
      derivedBundle,
      goToStep,
      resetBundle,
      restored,
      saveBundle,
      savedFeedback,
      selectOption,
      setCameraDiscount,
      setCameraVariant,
      toggleStep,
      updateCameraQuantity,
      updateSensorQuantity,
      togglePlanOption,
    ],
  );

  return <BundleContext.Provider value={value}>{children}</BundleContext.Provider>;
}
