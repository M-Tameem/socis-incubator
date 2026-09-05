import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">
        That page does not exist or has moved. Go to the{" "}
        <Link href="/" className="text-link underline underline-offset-4 hover:no-underline">
          homepage
        </Link>{" "}
        or check the{" "}
        <Link href="/timeline" className="text-link underline underline-offset-4 hover:no-underline">
          timeline
        </Link>
        .
      </p>
    </div>
  );
}
