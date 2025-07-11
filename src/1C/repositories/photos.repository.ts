import { server1C } from '../1c';

export const getAllPhotos = async () => {
	const serverResponse: any = await server1C({
		url: 'Catalog_ФизическиеЛица',
		params: {
			$select: 'Ref_Key,Фотография_Key',
			$format: 'json',
		},
	});
	return serverResponse.data['value'].map((item: any) => ({
		id: item.Ref_Key,
		name: item['Фотография_Key'].trim(),
	}));
};
