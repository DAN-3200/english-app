import { useAtom } from 'jotai';
import { TypingBox } from './parts/typingBox';
import { ctxModal, ctxType } from './share/context/ctxMain';
import { NavBar } from './parts/navBar';
import { Dictionary } from './parts/dictionary';
import { PackageWord } from './parts/packageWord';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
	const [wordInfo] = useAtom(ctxType.wordInfo);
	const [onModal] = useAtom(ctxModal.onModal);

	const Modal = {
		PackageWord: () => <PackageWord />,
	};

	return (
		<div className='h-svh bg-stone-700 p-1 grid place-items-center'>
			<div className='grid grid-rows-[auto_1fr_auto] gap-2 h-full py-3'>
				<NavBar />
				<TypingBox />
				<small className='text-center text-black/50 hover:text-gray-300 transition-color duration-800 font-bold h-max cursor-default mb-2'>
					@App web made in Brazil for Dev Daniel
				</small>
			</div>
			<AnimatePresence>
				{wordInfo && <Dictionary />}
				{onModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 grid place-items-center bg-black/50'>
						{Modal[onModal]?.()}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
