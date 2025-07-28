import { useAtom } from 'jotai';
import { ctxType } from '../share/context/ctxMain';
import { motion } from 'motion/react';
import * as luc from 'lucide-react';

export function Dictionary() {
	const [wordInfo, setWordInfo] = useAtom(ctxType.wordInfo);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			exit={{ opacity: 0 }}
			className='flex flex-col gap-1 text-left transition font-bold text-white fixed w-64 justify-self-start ml-20 p-5 min-h-10 rounded bg-black/50'>
			<div className='flex justify-between mb-2'>
				<span>Dictionary</span>{' '}
				<button
					className='cursor-pointer'
					onClick={() => setWordInfo(null)}>
					<luc.X size={20} />
				</button>
			</div>
			<small className='text-gray-200 text-xl'>{wordInfo?.word}</small>
			<small className='text-amber-200'>{wordInfo?.partOfSpeech}</small>
			<small className='text-blue-300'>{wordInfo?.definition}</small>
			<small className='text-green-300'>
				{wordInfo?.example && `"${wordInfo?.example}"`}
			</small>
			<small className='flex flex-col text-red-300'>
				{wordInfo?.synonyms?.map((item, index) => (
					<span
						key={index}
						className=''>
						{item}
					</span>
				))}
			</small>
		</motion.div>
	);
}
