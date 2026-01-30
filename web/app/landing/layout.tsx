export default function LandingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="w-full">{children}</div>
    </section>
  );
}
