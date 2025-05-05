import { useEffect } from "react";
import { useAtom } from "jotai";
import clsx from "clsx";
import { ModelPhrase } from "../share/types/types";
import { ctxType } from "../share/context/ctxMain";
import { Phrase } from "./wordModels";

export function TypingBox() {
	const [text, setText] = useAtom(ctxType.textTyping);
	const [modelPhrase, setModelPhrase] = useAtom(ctxType.modelPhrase);

	useEffect(() => {
		// ---
		(async () => {
			let json: ModelPhrase;
			try {
				json = await fetch("http://localhost:8000/getPhrase").then((res) =>
					res.json()
				);
			} catch (e) {
				console.log("Erro de Requisição: ", e);
				json = { English: "Error", Portuguese: "Error" } as ModelPhrase;
			}
			setModelPhrase(json);
		})();
		//---
	}, []);

	const xBorderColor = () => {
		const xBOOL = modelPhrase.English?.toLowerCase().includes(
			text.toLowerCase(),
		);

		if (xBOOL && text.length == modelPhrase.English.length) {
			return "border-green-300 bg-green-300/30";
		} else if (xBOOL) {
			return "peer-focus:border-black/60 peer-focus:bg-black/20";
		} else {
			return "peer-focus:border-red-400 peer-focus:bg-red-400/20";
		}
	};

	return (
		<div className="flex h-80 flex-col items-center justify-center self-center gap-4">
			<span className="justify-self-center text-xl font-bold text-white/90 ">
				{`"${modelPhrase.Portuguese}"`}
			</span>
			<div className="h-max max-w-130 min-w-40 min-h-20 place-content-center">
				<div className="relative">
					<input
						type="text"
						autoComplete="off"
						id="h-00"
						maxLength={modelPhrase.English?.length}
						spellCheck="false"
						onChange={(e) => {
							setText(e.currentTarget.value.toLowerCase());
						}}
						value={text}
						className="peer absolute select-none inset-0 h-full w-full cursor-default bg-transparent text-transparent opacity-0 outline-none"
					/>
					<div
						className={clsx(
							"flex flex-wrap h-full w-full content-start justify-center rounded border-3 border-black/50 px-10 py-3 text-xl transition",
							xBorderColor(),
						)}
					>
						{Phrase(modelPhrase.English?.trim())}
					</div>
				</div>
			</div>
			<NextButton />
		</div>
	);
}

function NextButton() {
	const [text, setText] = useAtom(ctxType.textTyping);
	const [modelPhrase, setModelPhrase] = useAtom(ctxType.modelPhrase);

	const getData = async () => {
		console.log("Ativo");
		let json: ModelPhrase;
		try {
			json = await fetch("http://localhost:8000/getPhrase").then((res) =>
				res.json()
			);
		} catch (e) {
			console.log("Erro de Requisição: ", e);
			json = {} as ModelPhrase;
		}
		setText("");
		setModelPhrase(json);
		document.getElementById("h-00")?.focus();
	};

	const onValid = text.toLowerCase() == modelPhrase.English?.toLowerCase();
	return (
		<button
			className={clsx(
				"h-10 w-30 rounded border-3 p-[1px_4px] font-bold",
				onValid
					? "cursor-pointer border-green-300 text-green-300 transition-colors duration-300 ease-in active:translate-x-1 focus:bg-green-300/20 focus:text-white outline-none"
					: "cursor border-black opacity-0",
			)}
			onClick={() => onValid && getData()}
		>
			Next
		</button>
	);
}
