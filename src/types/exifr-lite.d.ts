declare module "exifr/dist/lite.esm.mjs" {
	type ExifInput = ArrayBuffer | Blob | DataView | File | HTMLImageElement | Uint8Array;
	type ExifFilter = Array<number | string>;

	export function parse(
		data: ExifInput,
		options?: ExifFilter | boolean,
	): Promise<Record<string, unknown> | undefined>;
}
