import { useAtom } from 'jotai';
import { ctxMain, ctxModal } from '../share/context/ctxMain';
import { motion } from 'motion/react';
import * as luc from 'lucide-react';

export function PackageWord() {
	const [, setModal] = useAtom(ctxModal.onModal);
	const [packageWord] = useAtom(ctxMain.packageWord);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ ease: 'easeInOut', duration: 0.25 }}
			exit={{ opacity: 0 }}
			className='h-80 w-120 flex flex-col animate-surgir rounded-lg bg-[#28282b] overflow-hidden'>
			<div className='bg-black/60 h-12 flex justify-center items-center px-4 shrink-0'>
				<span className='text-gray-300 font-bold fixed'>WordPackage</span>
				<button
					className='ml-auto cursor-pointer font-bold text-stone-400 hover:text-white'
					onClick={() => setModal(null)}>
					<luc.X size={20}/>
				</button>
			</div>
			<div className='overflow-auto'>
				<div className='grid grid-cols-2 grid-rows-[auto] p-3 gap-2 '>
					{packageWord.map((item, index) => (
						<WordInPkg
							key={index}
							word={item}
						/>
					))}
				</div>
			</div>
		</motion.div>
	);
}

function WordInPkg({ word }: { word: string }) {
	return (
		<span className='text-white/80 px-2 py-1 shrink-0 rounded border-2 grid place-content-center border-white/80 font-bold cursor-pointer'>
			{word}
		</span>
	);
}
