

export function Button({
  text,
  link,
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
      href="https://ayotomcs.me/"
      className=" pb-3 underline text-base"
    >
      {text}
    </a>
    </Tag>
  );
}
