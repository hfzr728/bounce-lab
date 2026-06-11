import StepClient from "./StepClient";

export function generateStaticParams() {
  return Array.from({ length: 7 }, (_, i) => ({ step: String(i + 1) }));
}

export default function Page() {
  return <StepClient />;
}
