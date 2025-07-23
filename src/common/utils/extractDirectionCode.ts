export const extractdirectionCode = (data: string) => {
    if (!data) return ''; 
	const match = data.match(/(\d{2}\.\d{2}\.\d{2})/);
    return match ? match[0] : '';
};
