import { parse as parseExif } from "exifr/dist/lite.esm.mjs";

import type { PhotoMeta } from "@/data/photos";

export type ExifData = {
	aperture: string;
	cameraModel: string;
	dateTime: string;
	focalLength: string;
	iso: string;
	lensModel: string;
	shutterSpeed: string;
};

type RawExifData = {
	DateTimeOriginal?: Date | string;
	ExposureTime?: number;
	FNumber?: number;
	FocalLength?: number;
	ISO?: number | string;
	LensModel?: string;
	Model?: string;
};

const EXIF_TAGS = [
	"DateTimeOriginal",
	"ExposureTime",
	"FNumber",
	"FocalLength",
	"ISO",
	"LensModel",
	"Model",
] as const;

const padDatePart = (value: number): string => String(value).padStart(2, "0");

export const formatDate = (date: Date | string | undefined): string => {
	if (!date) return "-";
	if (typeof date === "string") return date;
	if (Number.isNaN(date.getTime())) return "-";

	return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(
		date.getDate(),
	)} ${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}:${padDatePart(
		date.getSeconds(),
	)}`;
};

export const formatShutterSpeed = (exposureTime: number | undefined): string => {
	if (!exposureTime || !Number.isFinite(exposureTime) || exposureTime < 0) return "-";
	if (exposureTime < 1) return `1/${Math.round(1 / exposureTime)}`;
	return `${Number(exposureTime.toFixed(3))}s`;
};

const formatExifData = (exif: RawExifData): ExifData => ({
	aperture: typeof exif.FNumber === "number" && exif.FNumber > 0 ? `F${exif.FNumber}` : "-",
	cameraModel: exif.Model?.trim() || "-",
	dateTime: formatDate(exif.DateTimeOriginal),
	focalLength:
		typeof exif.FocalLength === "number" && exif.FocalLength > 0 ? `${exif.FocalLength}mm` : "-",
	iso: exif.ISO === undefined || exif.ISO === "" ? "-" : String(exif.ISO),
	lensModel: exif.LensModel?.trim() || "-",
	shutterSpeed: formatShutterSpeed(exif.ExposureTime),
});

const getErrorMessage = (error: unknown): string =>
	error instanceof Error ? error.message : String(error);

async function readExif(url: string, signal?: AbortSignal): Promise<ExifData> {
	const response = await fetch(url, {
		cache: "force-cache",
		signal,
	});

	if (!response.ok) {
		throw new Error(`画像の取得に失敗しました (${response.status} ${response.statusText})`);
	}

	const blob = await response.blob();
	signal?.throwIfAborted();

	const exif = (await parseExif(blob, [...EXIF_TAGS])) as RawExifData | undefined;
	signal?.throwIfAborted();

	if (!exif) {
		throw new Error("EXIFデータが含まれていません");
	}

	return formatExifData(exif);
}

export async function getExifDataForPhoto(
	photo: PhotoMeta,
	signal?: AbortSignal,
): Promise<ExifData> {
	let lowResolutionError: unknown;

	try {
		return await readExif(photo.lowResUrl, signal);
	} catch (error) {
		if (signal?.aborted) throw error;
		lowResolutionError = error;
	}

	try {
		return await readExif(photo.highResUrl, signal);
	} catch (highResolutionError) {
		if (signal?.aborted) throw highResolutionError;

		throw new Error(
			`写真 ${photo.id} のEXIF取得に失敗しました。lowRes: ${getErrorMessage(
				lowResolutionError,
			)}; highRes: ${getErrorMessage(highResolutionError)}`,
		);
	}
}
