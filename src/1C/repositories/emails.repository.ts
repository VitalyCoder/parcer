import { server1C } from '../1c';

export const getAllEmails = async () => {
	const serverResponse: any = await server1C({
		url: 'Catalog_ФизическиеЛица_КонтактнаяИнформация',
		params: {
			$select: 'Ref_Key,АдресЭП',
			$format: 'json',
			$filter: "АдресЭП ne '' and like(АдресЭП, '%@sfedu.ru%')",
		},
	});
	return serverResponse.data['value'].map((item: any) => ({
		id: item.Ref_Key,
		name: item['АдресЭП'],
	}));
};
