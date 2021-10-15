import { load } from "./typetools";
export * from "./typetools";

load("font/PlusJakartaSans[wght].ttf").then((res) =>
	console.log("ttf\t:", res)
);
load("font/PlusJakartaSans-Italic[wght].ttf").then((res) =>
	console.log("ttf\t:", res)
);
