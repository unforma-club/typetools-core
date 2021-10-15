import { parseBuffer } from "./parser";

const bufferToArrayBuffer = (buffer: Buffer) => {
	const arraybuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arraybuffer);
	Array(buffer.length)
		.fill("")
		.forEach((_i, i) => {
			view[i] = buffer[i];
		});

	return arraybuffer;
};

const loadFromFile = (
	path: string,
	cb: (error: Error | null, ab?: ArrayBuffer) => any
) => {
	const fs = require("fs");
	fs.readFile(path, (err: any, buffer: Buffer) => {
		if (err) return cb(err.message);
		cb(null, bufferToArrayBuffer(buffer));
	});
};

const loadFromUrl = (
	url: string,
	cb: (error: Error | null, response?: any) => any
) => {
	const request = new XMLHttpRequest();
	request.open("get", url, true);
	request.responseType = "arraybuffer";
	request.onerror = () => cb(new Error("Font could not be loaded"));
	request.onload = () => {
		if (request.response) return cb(null, request.response);
		return cb(new Error("Font could not be loaded: " + request.statusText));
	};
	request.send();
};

const load = (url: string) => {
	const isNode = typeof window === "undefined";
	const loadFN = isNode ? loadFromFile : loadFromUrl;

	return new Promise((resolve, reject) => {
		loadFN(url, (err, buffer) => {
			if (err) reject(err);
			const font = parseBuffer(buffer);
			resolve(font);
		});
	});
};

// /**
//  * Only works on `node` environment
//  */
// const loadSync = (url: string) => {
// 	const fs = require("fs");
// 	const buffer = fs.readFileSync(url);
// 	return parseBuffer(bufferToArrayBuffer(buffer));
// };

export { load };
