type SaveButtonProps = {
  label: string;
};

export function SaveButton({ label }: SaveButtonProps) {
  return (
    <button className="save-button" type="button" aria-label={label}>
      Save
    </button>
  );
}
