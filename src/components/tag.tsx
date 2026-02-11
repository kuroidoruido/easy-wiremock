import { PropsWithChildren } from "react";
import "./tag.css";

export interface TagProps {
  tag: string;
}

export function Tag({ tag }: TagProps) {
  return <span className="tag">{tag}</span>;
}

export function TagContainer({ children }: PropsWithChildren) {
  return <div className="tag-container">{children}</div>;
}

export function renderTag(tag: string) {
  return <Tag key={tag} tag={tag} />;
}
