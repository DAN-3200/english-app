import { JSX, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import clsx from 'clsx';
import { inAnyRange, wordPosition } from '../utils/logic';
import { DictionaryEntry, ModelPhrase } from '../moduleTypes/types';


const cxtType = {
	textTyping: atom<string>(''),
	modelPhrase: atom<ModelPhrase>({
		Portuguese: '...',
		English: '...',
		omittedWord: ['...', '...'],
	} as ModelPhrase),
	wordInfo: atom<DictionaryEntry>(),
};

const HiddenWords = [];
// HiddenWords.push(wordPosition("miles", modelPhrase.English));
// HiddenWords.push(wordPosition("step", modelPhrase.English));

export function TypingBloc() {
	const [text, setText] = useAtom(cxtType.textTyping);
	const [modelPhrase, setModelPhrase] = useAtom(cxtType.modelPhrase);

	useEffect(() => {
		//
		(async () => {
			let json: ModelPhrase;
			try {
				json = await fetch('http://localhost:8000/getPhrase').then((res) =>
					res.json()
				);
			} catch (e) {
				console.log('Erro de Requisição: ', e);
				json = {} as ModelPhrase;
			}
			setModelPhrase(json);
		})();
		//
	}, []);

	const xBordeColor = () => {
		const xBOOL = modelPhrase.English?.toLowerCase().includes(
			text.toLowerCase()
		);

		if (xBOOL && text.length == modelPhrase.English.length) {
			return 'peer-focus:border-green-300';
		} else if (xBOOL) {
			return 'peer-focus:border-amber-300';
		} else {
			return 'peer-focus:border-red-300';
		}
	};

	return (
		<div className='flex h-80 flex-col items-center justify-center gap-4'>
			<span className='justify-self-center text-xl font-bold text-white opacity-60'>{`"${modelPhrase.Portuguese}"`}</span>
			<div className='relative'>
				<input
					type='text'
					autoComplete='off'
					maxLength={modelPhrase.English?.length}
					spellCheck='false'
					onChange={(e) => {
						setText(e.currentTarget.value.toLowerCase());
					}}
					value={text}
					className='peer absolute inset-0 h-full w-full cursor-default bg-transparent text-transparent opacity-0 outline-none'
				/>
				<div
					className={clsx(
						'flex h-max w-200 flex-wrap content-start justify-center rounded-xl border-2 border-black/40 px-10 py-3 text-xl transition',
						xBordeColor()
					)}>
					{Phrase(modelPhrase.English?.trim())}
				</div>
			</div>
			<NextButton />
			<WordInfo/>
		</div>
	);
}

function NextButton() {
	const [text, setText] = useAtom(cxtType.textTyping);
	const [modelPhrase, setModelPhrase] = useAtom(cxtType.modelPhrase);

	const getData = async () => {
		console.log('Ativo');
		let json: ModelPhrase;
		try {
			json = await fetch('http://localhost:8000/getPhrase').then((res) =>
				res.json()
			);
		} catch (e) {
			console.log('Erro de Requisição: ', e);
			json = {} as ModelPhrase;
		}
		setText('');
		setModelPhrase(json);
	};

	const onValid = text.toLowerCase() == modelPhrase.English?.toLowerCase();
	return (
		<button
			className={clsx(
				'mt-2 h-12 w-40 rounded-xl border-2 p-[2px_4px] font-bold bg-border-black/40',
				onValid
					? 'cursor-pointer border-green-300 text-green-300 transition-colors duration-300 ease-in active:translate-x-1'
					: 'cursor border-black opacity-40'
			)}
			onClick={() => onValid && getData()}>
			Next
		</button>
	);
}

function WordInfo() {
	const [wordInfo] = useAtom(cxtType.wordInfo)
	return <div className='flex flex-col gap-1 font-bold text-white'>
		<small className=''>{wordInfo?.word}</small>
		<small className=''>{wordInfo?.partOfSpeech}</small>
		<small className=''>{wordInfo?.definition}</small>
		<small className=''>{wordInfo?.translation}</small>
		<small className=''>{wordInfo?.synonyms}</small>
	</div>
}

// Sistema de Typing

function Phrase(text: string) {
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
	const [, setWordInfo] = useAtom(cxtType.wordInfo);
	const getData = async (word: string) => {
		let json: DictionaryEntry;
		try {
			json = await fetch(`http://localhost:8000/useDictionary/${word}`).then((res) =>
				res.json()
			);
		} catch (e) {
			console.log('Erro de Requisição: ', e);
			json = {} as DictionaryEntry;
		}
		console.log(json)
		setWordInfo(json);
	};
	return (
		<span
			onClick={() => getData(wordString)}
			className='block cursor-pointer border-b-2 font-bold transition border-transparent hover:text-amber-200 hover:border-b-white/20 active:border-b-white'>
			{value}
		</span>
	);
}

function Letter({ value, index }: { value: string; index: number }) {
	const [text] = useAtom(cxtType.textTyping);
	const [modelPhrase] = useAtom(cxtType.modelPhrase);

	const checkLetter = (index: number) => {
		let letterMold = modelPhrase.English[index].toLowerCase();
		let letterInput = text[index] || ''; // [text]

		if (letterInput == '') {
			if (inAnyRange(index, ...HiddenWords)) {
				return 'opacity-0 text-white';
			}
			return 'opacity-40 text-white';
		} else if (letterInput == letterMold && letterInput != undefined) {
			return 'text-green-300';
		} else {
			return 'text-red-300';
		}
	};

	return (
		<div className={clsx('inline-block', checkLetter(index))}>{value}</div>
	);
}

function Space({ index }: { index: number }) {
	const [text] = useAtom(cxtType.textTyping);
	const checkSpace = (index) => {
		let userInput = text[index] || '';

		if (userInput == '') {
			return 'opacity-40 bg-white';
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
