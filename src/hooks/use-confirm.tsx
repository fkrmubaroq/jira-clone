import { useState } from "react";

interface IuseModal<TModalName> {
	show?: boolean;
	modalName?: TModalName;
}

export function useModal<TModalName, TData = unknown>(
	initialOptions?: IuseModal<TModalName>,
) {
	const [currentShow, setCurrentShow] = useState(initialOptions?.show || false);
	const [name, setName] = useState<TModalName | undefined>(
		initialOptions?.modalName || undefined,
	);
	const [data, setData] = useState<TData | null>(null);

	const hideModal = () => {
		setCurrentShow(false);
		setName(undefined);
	};

	const showModal = (modalName: TModalName, currentData?: TData) => {
		setName(modalName);
		setCurrentShow(true);
		if (!currentData) return;
		setData(currentData);
	};

	return {
		data,
		setData,
		modalName: name,
		showModal,
		show: currentShow,
		hideModal,
	};
}
