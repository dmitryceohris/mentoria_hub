import type { ReactNode } from "react";

type ConsoleShellProps = {
  title: string;
  titleId?: string;
  intro?: string;
  coreClassName?: string;
  children: ReactNode;
};

export function ConsoleShell({ title, titleId, intro, coreClassName = "", children }: ConsoleShellProps) {
  return (
    <div className={`console-core ${coreClassName}`.trim()}>
      <div className="console-frame" aria-hidden="true" />
      <header className="console-header">
        <div>
          <h2 id={titleId}>{title}</h2>
          {intro ? <p className="console-intro">{intro}</p> : null}
        </div>
      </header>
      {children}
    </div>
  );
}
