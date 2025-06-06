import { useAtom } from 'jotai';
import { ctxType } from '../share/context/ctxMain';
import { JSX } from 'react';
import { DictionaryEntry } from '../share/types/types';
import { inAnyRange, wordPosition } from '../share/utils/logic';
import clsx from 'clsx';

export function Phrase(text: string) {
	let phraseInBlocs: JSX.Element[] = [];
	let groupOfLetter: JSX.Element[] = [];
	let keyForWord = 0;
	let wordString = '';

	for (let index = 0; index <= text?.length; index++) {
		let letra = text[index];

		if (letra != ' ' && index < text.length) {
			groupOfLetter.push(
				<Letter
					key={`Letter-${index}`}
					value={letra}
					index={index}
				/>
			);
			wordString += letra;
		} else {
			phraseInBlocs.push(
				<Word
					key={`Word-${keyForWord++}`}
					value={groupOfLetter}
					wordString={wordString}
				/>
			);

			if (index < text.length) {
				// Impidir que adicione um espaço branco após a utlima palavra
				phraseInBlocs.push(
					<Space
						key={`Space-${index}`}
						index={index}
					/>
				);
			}

			// Reseta o conjunto temporário
			groupOfLetter = [];
			wordString = '';
		}
	}

	return <>{phraseInBlocs}</>;
}

function Word({
	value,
	wordString,
}: {
	value: JSX.Element[];
	wordString: string;
}) {
	const [, setWordInfo] = useAtom(ctxType.wordInfo);
	const getData = async (word: string) => {
		let json: DictionaryEntry;
		try {
			json = await fetch(`http://localhost:8000/useDictionary/${word}`).then(
				(res) => res.json()
			);
		} catch (e) {
			console.log('Erro de Requisição: ', e);
			json = {} as DictionaryEntry;
		}
		console.log(json);
		setWordInfo(json);
	};
	return (
		<span
			onClick={() => getData(wordString)}
			className='cursor-pointer font-bold transition underline-offset-5 hover:underline decoration-2 hover:decoration-white/50 active:decoration-white z-1'>
			{value}
		</span>
	);
}

function Letter({ value, index }: { value: string; index: number }) {
	const [text] = useAtom(ctxType.textTyping);
	const [modelPhrase] = useAtom(ctxType.modelPhrase);
	const HiddenWords: [number, number][] = [];
	// HiddenWords.push(
	// 	wordPosition(modelPhrase.omittedWord[0], modelPhrase.English)
	// );
	// HiddenWords.push(
	// 	wordPosition(modelPhrase.omittedWord[1], modelPhrase.English)
	// );

	const checkLetter = (index: number) => {
		let letterMold = modelPhrase.English[index].toLowerCase();
		let letterInput = text[index] || ''; // [text]

		if (letterInput == '') {
			if (inAnyRange(index, ...HiddenWords)) {
				return 'opacity-0 text-white';
			}
			return 'text-black/50';
		} else if (letterInput == letterMold && letterInput != undefined) {
			return 'text-green-300';
		} else {
			return 'text-red-300';
		}
	};

	return <span className={clsx('', checkLetter(index))}>{value}</span>;
}

function Space({ index }: { index: number }) {
	const [text] = useAtom(ctxType.textTyping);
	const checkSpace = (index) => {
		let userInput = text[index] || '';

		if (userInput == '') {
			return 'bg-black/50';
		} else if (userInput == ' ') {
			return 'bg-green-300';
		} else {
			return 'bg-red-300';
		}
	};

	return (
		<span className='grid items-center px-1 py-1'>
			<div
				className={clsx(
					'bg-black-900 h-1 w-1 rounded-full',
					checkSpace(index)
				)}></div>
		</span>
	);
}
