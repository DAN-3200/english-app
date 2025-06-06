import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './client.tsx';
import './tailwind.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
