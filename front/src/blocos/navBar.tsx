export function NavBar() {
   let loc = {
      Bloc: ({ value = "" }) => (
         <span className="cursor-pointer rounded px-2 py-1 font-bold text-black/50 transition-colors duration-200 hover:bg-white/20">
            {value}
         </span>
      ),
   };

   return (
      <div className="flex h-16 w-[640px] items-center justify-between border-b-2 border-black/40 p-4">
         <h1 className="cursor-default font-bold text-black/50">!BrickWords</h1>
         <div className="flex gap-1">
            <loc.Bloc value="WordPackage" />
            <loc.Bloc value="P" />
         </div>
      </div>
   );
}
