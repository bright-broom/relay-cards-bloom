import type { ReactNode } from "react";

type ViewHeadingProps = {
  action?: ReactNode;
  description: string;
  kicker: string;
  title: string;
};

export function ViewHeading({ action, description, kicker, title }: ViewHeadingProps) {
  return (
    <header className="view-heading">
      <div>
        <span className="eyebrow">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}
