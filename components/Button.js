import Link from "next/link";

export function Button({
  text,
  borderColor,
  background,
  link = "/subscribe",
  color = "#DC2625",
  variant = "base",
  className = "",
}) {
  const Tag = variant === "heading" ? "h1" : "p";

  // Use <h4> for a "heading" variant; for base text, use <p>.

  return (
    <Tag>
      <span className="pb-3 inline-block">
        <Link
          href={link}
          style={{
            color, // text color
            borderColor,
            background//  color
          }}
          className=" px-2 py-1 underline underline-offset-2 text-sm border"
        >
          {text}
        </Link>
      </span>
    </Tag>
  );
}
