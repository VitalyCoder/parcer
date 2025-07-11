import { server1C } from '../1c';

export const getAllCurriculum = async () => {
	const serverResponse: any = await server1C({
		url: 'Document_УчебныйПлан',
		params: {
			$format: 'json',
			$select: 'Ref_Key, Number',
		},
	});
	return serverResponse.data['value'].map((item: any) => ({
		id: item.Ref_Key,
		name: item.Number,
	}));
};
