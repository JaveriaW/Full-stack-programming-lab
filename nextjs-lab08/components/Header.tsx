import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav>
        <Link href="/" className="mr-4">Home</Link>
        <Link href="/about">Go to About</Link>
      </nav>
    </header>
  );
}
