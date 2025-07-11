import { server1C } from '../1c';

export const getAllDisciplines = async () => {
	const serverResponse: any = await server1C({
		url: 'Catalog_Дисциплины',
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
