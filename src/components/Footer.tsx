export default function Footer() {
  return (
    <footer className="w-full bg-[#0E2240] text-white">
      <div className="max-w-screen-xl mx-auto text-center py-3 px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Built by House of Lisanity
        </p>
      </div>
    </footer>
  );
}
