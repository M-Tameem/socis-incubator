import { Field } from "@/components/form";
import { Input } from "@/components/ui/input";

export function RecoveryField({ creating = false }: { creating?: boolean }) {
  return (
    <Field label="Recovery answer" name="recovery_answer" required
      hint={creating
        ? "What is a memorable word or phrase only you know? Choose at least 4 characters, different from your password. You'll use it if you forget your password."
        : "What is a memorable word or phrase only you know? Enter the answer you chose when creating your account. Capitalization does not matter."}>
      <Input id="recovery_answer" name="recovery_answer" type="password" autoComplete="off" required minLength={4} maxLength={128} />
    </Field>
  );
}
