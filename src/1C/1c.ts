import axios from 'axios';
import * as dotenv from 'dotenv';
import qs from 'qs';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}.local` });

export const server1C = axios.create({
	method: 'GET',
	auth: {
		username: process.env.ONEC_USER as string,
		password: process.env.ONEC_PWD as string,
	},
	baseURL:
		'https://hq-1c-web-exchange.sfedu.ru/1C-UniverTest_2/odata/standard.odata/',
	paramsSerializer: params => {
		// @ts-expect-error undefined
		return qs.stringify(params, { encode: 'utf-8', arrayFormat: 'repeat' });
	},
});
