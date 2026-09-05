export function PageHeader({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-10">
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>
      {lede ? (
        <p className="prose-page mt-4 text-lg leading-8 text-muted-foreground">{lede}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
