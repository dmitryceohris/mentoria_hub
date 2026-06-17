type MatchButtonProps = {
  label: string;
};

export function MatchButton({ label }: MatchButtonProps) {
  return (
    <button className="match-button" type="button" aria-label={label}>
      Match
    </button>
  );
}
