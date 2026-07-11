type DateValue = Date | number | string;

type DatedItem = {
	date: DateValue;
};

const toTimestamp = (value: DateValue): number =>
	value instanceof Date ? value.getTime() : new Date(value).getTime();

export function sortByDate<T extends DatedItem>(a: T, b: T): number {
	const aTimestamp = toTimestamp(a.date);
	const bTimestamp = toTimestamp(b.date);
	const aIsInvalid = Number.isNaN(aTimestamp);
	const bIsInvalid = Number.isNaN(bTimestamp);

	if (aIsInvalid && bIsInvalid) return 0;
	if (aIsInvalid) return 1;
	if (bIsInvalid) return -1;

	return bTimestamp - aTimestamp;
}
