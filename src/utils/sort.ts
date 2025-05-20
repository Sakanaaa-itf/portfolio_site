export const sortByDate = (a: any, b: any) => {
	return new Date(b.date).getTime() - new Date(a.date).getTime();
};
