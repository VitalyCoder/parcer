export const separateName = (data: string) => {
	const splitString = data.split(' ');
	if (splitString.length === 4) {
		const lastName = splitString[0] + ' ' + splitString[1];
		const firstName = splitString[2];
		const middleName = splitString[3];
		return { lastName, firstName, middleName };
	}
	if (splitString.length === 3) {
		const lastName = splitString[0];
		const firstName = splitString[1];
		const middleName = splitString[2];
		return { lastName, firstName, middleName };
	}
	if (splitString.length === 2) {
		const lastName = splitString[0];
		const firstName = splitString[1];
		return { lastName, firstName, middleName: null };
	}
};
