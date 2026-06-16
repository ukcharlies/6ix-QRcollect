import { AppShell } from "@/components/AppShell";
import { FormBuilder } from "@/components/FormBuilder";

export default function Home() {
  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">Create a QR form</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Build a custom form, generate a scan-ready QR code, and review responses from a private manage link.
        </p>
      </div>
      <FormBuilder />
    </AppShell>
  );
}
