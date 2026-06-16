import { PropsWithChildren } from "react";
import "./tag.css";
import { isDefinedAndNotEmpty } from "@anthonypena/fp";

export interface TagProps {
  tag: string;
  title?: string;
}

export function Tag({ tag, title }: TagProps) {
  return (
    <span className="tag" {...(isDefinedAndNotEmpty(title) ? { title } : {})}>
      {tag}
    </span>
  );
}

export function TagContainer({ children }: PropsWithChildren) {
  return <div className="tag-container">{children}</div>;
}

export function renderTag(tag: string) {
  return <Tag key={tag} tag={tag} />;
}
