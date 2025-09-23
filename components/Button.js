

export function Button({
  text,
  link = "/subscribe",
  color = "#DC2625",
  variant = "base",
  className = "",
}) {

  const Tag = variant === "heading" ? "h1" : "p";

  // Use <h4> for a "heading" variant; for base text, use <p>.

  return (
    <Tag>
    <a
    style={{color}}
      href={link}
      className=" pb-3 underline text-base"
    >
      {text}
    </a>
    </Tag>
  );
}
