import { server1C } from '../1c';

export const getAllGroups = async () => {
	const serverResponse: any = await server1C({
		url: 'Catalog_УчебныеГруппы',
		params: {
			$select: 'Ref_Key,Description',
			$format: 'json',
			$filter: 'Актуальность eq true',
		},
	});
	return serverResponse.data['value'].map((item: any) => ({
		id: item.Ref_Key,
		name: item.Description.trim(),
	}));
};
