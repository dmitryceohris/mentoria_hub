import { useT } from "../lib/i18n";

type MatchButtonProps = {
  label: string;
};

export function MatchButton({ label }: MatchButtonProps) {
  const t = useT();

  return (
    <button className="match-button" type="button" aria-label={label}>
      {t.actions.match}
    </button>
  );
}
