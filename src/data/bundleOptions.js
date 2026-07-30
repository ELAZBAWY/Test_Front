import bundleData from "./bundleData.json";

export const BUNDLE_STEPS = bundleData.Steps;

export const STEP_ORDER = ["cameras", ...BUNDLE_STEPS.map((step) => step.id)];
