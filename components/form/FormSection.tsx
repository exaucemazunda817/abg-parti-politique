export default function FormSection({
  number,
  title,
  hint,
  children,
}: {
  number: number;
  title: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <legend className="flex items-center gap-3 px-1">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-abg-blue-dark text-sm font-bold text-white">
          {number}
        </span>
        <span className="text-lg font-bold text-abg-blue-dark">{title}</span>
        {hint && <span className="text-sm font-normal text-foreground/50">{hint}</span>}
      </legend>
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}
