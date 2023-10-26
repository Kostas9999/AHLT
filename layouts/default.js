import { Navbar } from "@/components/navbar";
import { Logo, Logo_s } from "@/components/icons";
import { Link } from "@nextui-org/link";
import { Head } from "./head";

export default function DefaultLayout({ children }) {
  return (
    <div className="relative flex flex-col h-screen w-1\5 ">
      <Head />
      <Navbar />
      <main className="h-screen flex  justify-center">{children}</main>
      <footer className=" flex items-center justify-center py-3 	">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="#"
          title="AHLT"
        >
          <Logo_s />
          B00148740
        </Link>
      </footer>
    </div>
  );
}
