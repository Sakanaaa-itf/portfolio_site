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
	if (!date) return "-";
	if (typeof date === "string") return date;
	if (date instanceof Date) {
		const jstTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
		return jstTime.toISOString().replace("T", " ").split(".")[0];
	}
	return "-";
};

export const formatShutterSpeed = (
	exposureTime: number | undefined
): string => {
	if (!exposureTime) return "-";
	if (exposureTime < 1) {
		const denominator = Math.round(1 / exposureTime);
		return `1/${denominator}`;
	}
	return `${exposureTime}s`;
};

export const getExifDataForPhoto = async (
	photo: PhotoMeta
): Promise<ExifData | null> => {
	try {
		// キャッシュ無効化のために { cache: "no-store" } を指定
		const response = await fetch(photo.lowResUrl, { cache: "no-store" });
		const blob = await response.blob();
		const exif = await exifr.parse(blob);

		if (!exif) {
			throw new Error("lowResUrl でEXIFデータが取得できませんでした");
		}
		return {
			dateTime: formatDate(exif?.DateTimeOriginal),
			cameraModel: exif?.Model || "-",
			lensModel: exif?.LensModel || "-",
			aperture: exif?.FNumber ? `F${exif.FNumber}` : "-",
			shutterSpeed: exif?.ExposureTime
				? formatShutterSpeed(exif.ExposureTime)
				: "-",
			iso: exif?.ISO || "-",
		};
	} catch (errorLow) {
		console.error(`EXIF 取得失敗 (lowRes): ${photo.id}`, errorLow);
		try {
			// highResUrl でもキャッシュを使わないように指定
			const response = await fetch(photo.highResUrl, { cache: "no-store" });
			const blob = await response.blob();
			const exif = await exifr.parse(blob);
			return {
				dateTime: formatDate(exif?.DateTimeOriginal),
				cameraModel: exif?.Model || "-",
				lensModel: exif?.LensModel || "-",
				aperture: exif?.FNumber ? `F${exif.FNumber}` : "-",
				shutterSpeed: exif?.ExposureTime
					? formatShutterSpeed(exif.ExposureTime)
					: "-",
				iso: exif?.ISO || "-",
			};
		} catch (errorHigh) {
			console.error(`EXIF 取得失敗 (highRes): ${photo.id}`, errorHigh);
			return null;
		}
	}
};
