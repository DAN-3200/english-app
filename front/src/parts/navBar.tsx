import { useAtom } from 'jotai';
import { ctxModal } from '../share/context/ctxMain';
import * as luc from 'lucide-react';

export function NavBar() {
	let loc = {
		Bloc: ({ value = '', onClick }: { value: any; onClick?: () => void }) => (
			<span
				onClick={onClick}
				className='cursor-pointer rounded px-2 py-1 font-bold text-gray-300 transition-colors duration-200  hover:underline underline-offset-7 decoration-2'>
				{value}
			</span>
		),
	};
	const [, setModal] = useAtom(ctxModal.onModal);

	return (
		<div className='flex h-14 w-[640px] items-center justify-between px-8 py-2 bg-black/50 rounded'>
			<h1 className='cursor-default font-bold text-gray-300'>WriteEn</h1>
			<div className='flex gap-1'>
				<loc.Bloc
					value='WordPackage'
					onClick={() => setModal('PackageWord')}
				/>
				<loc.Bloc value={<luc.User />} />
			</div>
		</div>
	);
}
