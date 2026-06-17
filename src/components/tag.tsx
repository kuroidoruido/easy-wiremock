import { PropsWithChildren } from "react";
import "./tag.css";
import { isDefined, isDefinedAndNotEmpty } from "@anthonypena/fp";

export interface TagProps {
  tag: string;
  title?: string;
  onDismiss?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function Tag({ tag, title, onDismiss }: TagProps) {
  return (
    <span className="tag" {...(isDefinedAndNotEmpty(title) ? { title } : {})}>
      {tag}
      {isDefined(onDismiss) ? (
        <button type="button" onClick={onDismiss}>
          ×
        </button>
      ) : (
        <></>
      )}
    </span>
  );
}

export function TagContainer({ children }: PropsWithChildren) {
  return <div className="tag-container">{children}</div>;
}

export function renderTag(tag: string) {
  return <Tag key={tag} tag={tag} />;
}
