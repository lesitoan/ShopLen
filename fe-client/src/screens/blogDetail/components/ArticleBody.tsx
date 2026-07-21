import React from "react";
import styles from "./ArticleBody.module.css";

interface ArticleBodyProps {
  content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <article
      className={`${styles.articleContent} text-text-primary`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
