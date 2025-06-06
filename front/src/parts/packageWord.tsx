import { useAtom } from 'jotai';
import { ctxModal } from '../share/context/ctxMain';

export function PackageWord() {
	const [, setModal] = useAtom(ctxModal.onModal);
	return (
		<div className='h-80 w-120 flex flex-col animate-surgir rounded-lg bg-[#28282b] overflow-hidden'>
			<div className='bg-black/60 h-12 flex justify-center items-center px-4 shrink-0'>
				<span className='text-gray-300 font-bold fixed'>WordPackage</span>
				<button
					className='ml-auto cursor-pointer font-bold text-black/50 hover:text-white'
					onClick={() => setModal(null)}>
					X
				</button>
			</div>
			<div className='overflow-auto'>
				<div className='grid grid-cols-2 grid-rows-[auto] p-3 gap-2 '>
					<WordInPkg word='Word' />
					<WordInPkg word='Word' />
					<WordInPkg word='Word' />
				</div>
			</div>
		</div>
	);
}

function WordInPkg({ word }: { word: string }) {
	return (
		<span className='text-white/80 px-2 py-1 shrink-0 rounded border-2 grid place-content-center border-white/80 font-bold'>
			{word}
		</span>
	);
}
