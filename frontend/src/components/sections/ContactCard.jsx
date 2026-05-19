export default function ContactCard({ card }) {
  return (
    <article className={`rounded-2xl border p-5 ${card.className}`}>
      <h3 className="text-lg font-black">{card.title}</h3>
      <div className="mt-3 grid gap-2 text-sm font-semibold leading-6">
        {card.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </article>
  );
}
