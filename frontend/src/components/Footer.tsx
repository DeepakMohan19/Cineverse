import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#141414] text-gray-500 py-12 px-4 md:px-12 mt-auto border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white">
    Cine<span className="text-red-500">Verse</span>
  </h2>
          <p className="text-sm">Questions? Call 1-800-CINEVERSE-NOW</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-light">
          <div className="flex flex-col gap-3">
            <Link href="/" className="hover:underline">FAQ</Link>
            <Link href="/" className="hover:underline">Investor Relations</Link>
            <Link href="/" className="hover:underline">Privacy</Link>
            <Link href="/" className="hover:underline">Speed Test</Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/" className="hover:underline">Help Center</Link>
            <Link href="/" className="hover:underline">Jobs</Link>
            <Link href="/" className="hover:underline">Cookie Preferences</Link>
            <Link href="/" className="hover:underline">Legal Notices</Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/" className="hover:underline">Account</Link>
            <Link href="/" className="hover:underline">Ways to Watch</Link>
            <Link href="/" className="hover:underline">Corporate Information</Link>
            <Link href="/" className="hover:underline">Only on Cineverse</Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/" className="hover:underline">Media Center</Link>
            <Link href="/" className="hover:underline">Terms of Use</Link>
            <Link href="/" className="hover:underline">Contact Us</Link>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs">&copy; {currentYear} Cineverse India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
