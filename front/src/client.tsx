import { useAtom } from "jotai";
import { TypingBox } from "./parts/typingBox";
import { ctxModal, ctxType } from "./share/context/ctxMain";
import { NavBar } from "./parts/navBar";
import { Dictionary } from "./parts/dictionary";
import { PackageWord } from "./parts/packageWord";

export default function App() {
   const [wordInfo] = useAtom(ctxType.wordInfo);
   const [onModal] = useAtom(ctxModal.onModal)

   const Modal = {
      PackageWord: () => <PackageWord/>
   }

   return (
      <div className="h-svh bg-[#28282b] p-1 grid place-items-center">
         <div className="grid grid-rows-[auto_1fr_auto] gap-2 h-full py-3">
            <NavBar />
            <TypingBox />
            <small className="text-center text-black/50 hover:text-gray-300 transition-color duration-800 font-bold h-max cursor-default mb-2">
               @App web made in Brazil for Dev Daniel
            </small>
         </div>
         {wordInfo && <Dictionary />}
         {onModal &&
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
               {Modal[onModal]?.()}
            </div>
         }
         
      </div>
   );
}

