import { server1C } from '../1c';

export const getAllEmployees = async () => {
	const serverResponse: any = await server1C({
		url: 'InformationRegister_ЗакреплениеЗаКафедрой_RecordType',
		params: {
			$format: 'json',
			$filter: `(Кафедра_Key eq guid'ec1e1366-5733-11e3-9024-00155de36503' or Кафедра_Key eq guid'e5d7144b-5733-11e3-9024-00155de36503' or Кафедра_Key eq guid'ec1e1367-5733-11e3-9024-00155de36503' or Кафедра_Key eq guid'e5d71290-5733-11e3-9024-00155de36503' or Кафедра_Key eq guid'e5d71302-5733-11e3-9024-00155de36503' and Кафедра_Key eq guid'b42711a4-6881-11ee-b590-00155d0116cc' or Кафедра_Key eq guid'fc81bce8-5731-11e3-9024-00155de36503' or Кафедра_Key eq guid'e5d71292-5733-11e3-9024-00155de36503' or Кафедра_Key eq guid'fc81bce2-5731-11e3-9024-00155de36503' or Кафедра_Key eq guid'ec1e13fe-5733-11e3-9024-00155de36503' or Кафедра_Key eq guid'e5d71301-5733-11e3-9024-00155de36503' or Кафедра_Key eq guid'e5d71293-5733-11e3-9024-00155de36503' or Кафедра_Key eq guid'29502b54-b64d-11ee-b594-00155d011a8e') and Состояние eq 'Работает' and УчебныйГод_Key eq guid'${process.env.CUR_YEAR}'`,
			$select:
				'Сотрудник_Key,Должность_Key,Ставка_Key,Кафедра_Key,ВидЗанятости',
		},
	});
	return serverResponse.data['value'];
};
