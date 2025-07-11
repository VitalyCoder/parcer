import { server1C } from '../1c';

export const getAllConditions = async () => {
	const serverResponse: any = await server1C({
		url: 'Catalog_СостоянияФизическихЛиц',
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
