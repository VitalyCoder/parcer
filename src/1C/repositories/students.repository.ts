import { server1C } from '../1c';

export const getAllStudents = async () => {
	const serverResponse: any = await server1C({
		url: "InformationRegister_СостояниеСтудентов_RecordType/SliceLast(Period=datetime'2024-09-12T00:00:00')",
		params: {
			$format: 'json',
			$filter:
				"Факультет_Key eq guid'483e2186-d437-11e3-b261-00155d01150d' and (Состояние_Key eq guid'10f31b6b-85af-4a1b-8173-b1caafb65633' or Состояние_Key eq guid'4dcf7d21-ba28-480a-83e1-a18870a45bb5' or Состояние_Key eq guid'6798f7bc-7942-4591-9da5-715e0471b85e' or Состояние_Key eq guid'3208f314-769e-4835-9fd5-48af26f61d2e' or Состояние_Key eq guid'6b2d76b2-a3c4-4c83-a053-0f95c83500de' or Состояние_Key eq guid'505e3222-0e04-4b11-a356-1a456e6c9488' or Состояние_Key eq guid'7f45c774-774b-41e8-a73a-0caafded355e' or Состояние_Key eq guid'17f8cd04-4809-4177-aab4-9ab56b8f6164' or Состояние_Key eq guid'ea382402-44c3-4f2e-b3fe-5579feefeff8' or Состояние_Key eq guid'6d2caa47-8ba4-4155-b433-95acecd88af4' or Состояние_Key eq guid'59a1ed58-281c-11ec-b54c-00155d20652d' or Состояние_Key eq guid'a2a79c9d-1982-4a86-b8ac-8a9d1c9dfdf3' or Состояние_Key eq guid'cf387c2c-80e9-41b8-bbf7-03e2b8c299e0')",
		},
	});
	return serverResponse.data['value'];
};
