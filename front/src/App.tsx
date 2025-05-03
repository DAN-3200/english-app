import { TypingBloc } from "./blocos/typingBloc";
import { NavBar } from "./blocos/navBar";

export default function App() {
   return (
      <div className="h-lvh bg-[#28282b] p-3 grid place-items-center">
         <div className="flex flex-col items-center  gap-4 h-180">
            <NavBar />
            <TypingBloc />
         </div>
      </div>
   );
}
