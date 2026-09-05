export default function PageHero({
  eyebrow,
  title,
  subtitle,
  color = "green",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  color?: "green" | "blue";
}) {
  const bg = color === "blue" ? "bg-abg-blue-dark" : "bg-abg-green-dark";

  return (
    <>
      <section className={`${bg} text-white`}>
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-2xl text-white/85">{subtitle}</p>}
        </div>
      </section>
      <div className="abg-accent-bar" />
    </>
  );
}
