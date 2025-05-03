import * as exifr from "exifr";

import type { PhotoMeta } from "@/data/photos";

export type ExifData = {
	aperture?: string;
	cameraModel?: string;
	dateTime?: string;
	focalLength?: string;
	iso?: string;
	lensModel?: string;
	shutterSpeed?: string;
};

export const formatDate = (date: Date | string | undefined): string => {
	if (!date) return "-";
	if (typeof date === "string") return date;
	if (date instanceof Date) {
		const jstTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
		return jstTime.toISOString().replace("T", " ").split(".")[0];
	}
	return "-";
};

export const formatShutterSpeed = (exposureTime: number | undefined): string => {
	if (!exposureTime) return "-";
	if (exposureTime < 1) {
		const denominator = Math.round(1 / exposureTime);
		return `1/${denominator}`;
	}
	return `${exposureTime}s`;
};

export const getExifDataForPhoto = async (photo: PhotoMeta): Promise<ExifData | null> => {
	try {
		const response = await fetch(photo.lowResUrl, { cache: "no-store" });
		const blob = await response.blob();
		const exif = await exifr.parse(blob);

		if (!exif) {
			throw new Error("lowResUrl でEXIFデータが取得できませんでした");
		}

		return {
			aperture: exif?.FNumber ? `F${exif.FNumber}` : "-",
			cameraModel: exif?.Model || "-",
			dateTime: formatDate(exif?.DateTimeOriginal),
			focalLength: exif?.FocalLength ? `${exif.FocalLength}mm` : "-",
			iso: exif?.ISO || "-",
			lensModel: exif?.LensModel || "-",
			shutterSpeed: exif?.ExposureTime ? formatShutterSpeed(exif.ExposureTime) : "-",
		};
	} catch (errorLow) {
		console.error(`EXIF 取得失敗 (lowRes): ${photo.id}`, errorLow);
		try {
			const response = await fetch(photo.highResUrl, { cache: "no-store" });
			const blob = await response.blob();
			const exif = await exifr.parse(blob);

			return {
				aperture: exif?.FNumber ? `F${exif.FNumber}` : "-",
				cameraModel: exif?.Model || "-",
				dateTime: formatDate(exif?.DateTimeOriginal),
				focalLength: exif?.FocalLength ? `${exif.FocalLength}mm` : "-",
				iso: exif?.ISO || "-",
				lensModel: exif?.LensModel || "-",
				shutterSpeed: exif?.ExposureTime ? formatShutterSpeed(exif.ExposureTime) : "-",
			};
		} catch (errorHigh) {
			console.error(`EXIF 取得失敗 (highRes): ${photo.id}`, errorHigh);
			return null;
		}
	}
};
