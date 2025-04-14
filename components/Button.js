

export function Button({
  text,
  link,
  color = "#333",
  variant = "base",
  className = "",
}) {

  const Tag = variant === "heading" ? "h1" : "p";

  // Use <h4> for a "heading" variant; for base text, use <p>.

  return (
    <Tag>
    <a
    style={{color}}
      href="https://ayotomcs.me/"
      className=" pb-3 underline text-sm"
    >
      {text}
    </a>
    </Tag>
  );
}
