import app from './app';

import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}.local` });

const server = app.listen(process.env.PORT, () => {
	console.log(`Listen on :${process.env.PORT}`);
});

export default server;
