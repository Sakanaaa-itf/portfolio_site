import * as exifr from "exifr";
import type { PhotoMeta } from "@/data/photos";

export type ExifData = {
	dateTime?: string;
	cameraModel?: string;
	lensModel?: string;
	aperture?: string;
	shutterSpeed?: string;
	iso?: string;
};

export const formatDate = (date: Date | string | undefined): string => {
	if (!date) return "不明";
	if (typeof date === "string") return date;
	if (date instanceof Date) {
		const jstTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
		return jstTime.toISOString().replace("T", " ").split(".")[0];
	}
	return "不明";
};

export const formatShutterSpeed = (exposureTime: number | undefined): string => {
	if (!exposureTime) return "不明";
	if (exposureTime < 1) {
		const denominator = Math.round(1 / exposureTime);
		return `1/${denominator}`;
	}
	return `${exposureTime}s`;
};

export const getExifDataForPhotos = async (photos: PhotoMeta[]): Promise<Record<string, ExifData | null>> => {
	const exifMap: Record<string, ExifData | null> = {};
	await Promise.all(
		photos.map(async (photo) => {
			try {
				const response = await fetch(photo.highResUrl);
				const blob = await response.blob();
				const exif = await exifr.parse(blob);
				exifMap[photo.id] = {
					dateTime: formatDate(exif?.DateTimeOriginal),
					cameraModel: exif?.Model || "不明",
					lensModel: exif?.LensModel || "不明",
					aperture: exif?.FNumber ? `F${exif.FNumber}` : "不明",
					shutterSpeed: exif?.ExposureTime ? formatShutterSpeed(exif.ExposureTime) : "不明",
					iso: exif?.ISO || "不明",
				};
			} catch (error) {
				console.error(`EXIF データ取得失敗: ${photo.id}`, error);
				exifMap[photo.id] = null;
			}
		})
	);
	return exifMap;
};
