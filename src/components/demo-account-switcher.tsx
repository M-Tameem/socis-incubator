import { enterDemo, leaveDemo } from "@/app/demo/actions";
import { Button } from "@/components/ui/button";
import type { DemoRole } from "@/lib/demo";

export function DemoAccountSwitcher({ active }: { active?: DemoRole }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={enterDemo}>
        <input type="hidden" name="role" value="student" />
        <Button type="submit" variant={active === "student" ? "default" : "outline"}>
          Student view
        </Button>
      </form>
      <form action={enterDemo}>
        <input type="hidden" name="role" value="exec" />
        <Button type="submit" variant={active === "exec" ? "default" : "outline"}>
          Executive view
        </Button>
      </form>
      {active ? (
        <form action={leaveDemo}>
          <Button type="submit" variant="ghost">Leave demo</Button>
        </form>
      ) : null}
    </div>
  );
}
