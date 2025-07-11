import { server1C } from '../1c';

export const getAllControlTypes = async () => {
	const serverResponse: any = await server1C({
		url: 'Catalog_ВидыКонтроля',
		params: {
			$format: 'json',
			$select: 'Ref_Key, Description',
		},
	});
	return serverResponse.data['value'].map((item: any) => ({
		id: item.Ref_Key,
		name: item.Description.trim(),
	}));
};
