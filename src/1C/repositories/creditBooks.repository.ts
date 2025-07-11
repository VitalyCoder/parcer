import { server1C } from '../1c';

export const getAllCreditBooks = async () => {
	const serverResponse: any = await server1C({
		url: 'Catalog_ЗачетныеКниги',
		params: {
			$select: 'Ref_Key,Description',
			$format: 'json',
		},
	});
	return serverResponse.data['value'].map((item: any) => ({
		id: item.Ref_Key,
		name: item.Description.trim(),
	}));
};
