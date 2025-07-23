export const extractЕducationLevel = (data: string | null) => {
    if (!data) return ''; 

	const match = data.match(/\d{2}\.(\d{2})/);
    if(match){
        switch(match[1]){
            case '03':  return 'Бакалавриат';
            case '04':  return 'Магистратура';
            case '05':  return 'Специалитет';
            case '06':  return 'Аспирантура';
            default: return '';
        }
    } 
    else {
        return '';
    } 
};
