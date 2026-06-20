type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
    </header>
  );
}
