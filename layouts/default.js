import { Navbar } from "@/components/navbar";
import { Logo,Logo_s } from "@/components/icons";
import { Link } from "@nextui-org/link";
import { Head } from "./head";

export default function DefaultLayout({ children }) {
  return (
    <div   className="relative flex flex-col h-screen w-1\5 ">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow " >
        {children}
      </main>
      <footer className=" flex items-center justify-center py-3 	">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="http://ip-fs.cloud"
          title="IPFS"
        >
        <Logo_s/>
        </Link>
      </footer>
    </div>
  );
}
