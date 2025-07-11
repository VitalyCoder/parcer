import { server1C } from '../1c';

export const getOneWorkload = async (unitId: string) => {
	const serverResponse: any = await server1C({
		url: 'Document_РаспределениеПоручений',
		params: {
			$format: 'json',
			$filter: `Кафедра_Key eq guid'${unitId}' and УчебныйГод_Key eq guid'${process.env.CUR_YEAR}'`,
		},
	});
	return serverResponse.data['value'];
};
