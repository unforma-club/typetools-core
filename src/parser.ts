export const getTag = (dataView: DataView, offset: number) => {
	let tag = "";
	for (let i = offset; i < offset + 4; i += 1) {
		tag += String.fromCharCode(dataView.getInt8(i));
	}
	return tag;
};

export const getUShort = (dataView: DataView, offset: number) => {
	return dataView.getUint16(offset, false);
};

export const parseBuffer = (buffer: ArrayBuffer) => {
	const data = new DataView(buffer, 0);
	const signature = getTag(data, 0);

	let outlinesFormat: string | undefined = undefined;
	let numTables: any = undefined;

	if (
		signature === String.fromCharCode(0, 1, 0, 0) ||
		signature === "true" ||
		signature === "typ1"
	) {
		outlinesFormat = "truetype";
		numTables = getUShort(data, 4);
	} else if (signature === "OTTO") {
		outlinesFormat = "cff";
		numTables = getUShort(data, 4);
	} else if (signature === "wOFF") {
		const flavor = getTag(data, 4);
		if (flavor === String.fromCharCode(0, 1, 0, 0)) {
			outlinesFormat = "truetype";
		}
		if (flavor === "OTTO") {
			outlinesFormat = "cff";
		}
		numTables = getUShort(data, 12);
	} else {
		outlinesFormat = undefined;
	}

	return { outlinesFormat, numTables };
};
