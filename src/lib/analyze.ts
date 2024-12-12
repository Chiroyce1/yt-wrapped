import type { Video } from "./utils";

// Aggregate data by property
export function analyzeProperty(
	data: Video[],
	propertyPath: string[],
	transform: (value: any) => string = (val) => val,
	start = 0,
	end = 100
): { keys: string[]; values: number[] } {
	const result: { [key: string]: number } = {};

	// Aggregate counts based on transformed values
	data.forEach((item) => {
		let value: any = item;
		for (const prop of propertyPath) {
			value = value?.[prop];
		}
		const transformedValue = transform(value);
		if (transformedValue in result) {
			result[transformedValue]++;
		} else {
			result[transformedValue] = 1;
		}
	});

	// Convert object to sorted array of entries, sorted by values (descending)
	const sortedEntries = Object.entries(result)
		.sort(([, a], [, b]) => b - a) // Sort by values
		.slice(start, end); // Take the requested slice

	// Separate the keys and values into separate arrays
	const keys = sortedEntries.map(([key]) => key);
	const values = sortedEntries.map(([, value]) => value);

	// Return both keys and values
	return { keys, values };
}
