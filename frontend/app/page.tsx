import Image from "next/image";
import Keywords from "./keywords";
import Recorder from "./recorder";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="relative flex flex-col w-screen max-w-screen-lg place-items-center">
        <Keywords />
        <Recorder />
      </div>

      
    </main>
  );
}
