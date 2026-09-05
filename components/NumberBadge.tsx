export default function NumberBadge({ n }: { n: number }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-abg-blue-dark/10 text-sm font-bold text-abg-blue-dark">
      {n}
    </span>
  );
}
