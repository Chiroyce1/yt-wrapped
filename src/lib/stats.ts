function timeOfDay(hour: number) {
	if (hour >= 5 && hour < 9) {
		return "5AM - 9AM";
	} else if (hour >= 9 && hour < 12) {
		return "9AM - 12 noon";
	} else if (hour >= 12 && hour < 16) {
		return "noon - 4PM";
	} else if (hour >= 16 && hour < 19) {
		return "4PM - 7PM";
	} else if (hour >= 19 && hour < 22) {
		return "7PM - 10PM";
	} else {
		return "10PM - 5AM";
	}
}

export const st = [
	{
		stat: "Videos watched throughout the week",
		func: (timeStr: string) => {
			const day = new Date(timeStr).getDay();
			return [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			][day];
		},
		info: "You watch most videos on a",
	},

	{
		stat: "Videos watched throughout the day",
		func: (timeStr: string) => {
			const hour = new Date(timeStr).getHours();
			return timeOfDay(hour);
		},
		info: "You watch most videos around",
	},

	{
		stat: "Videos watched at different times",
		func: (timeStr: string) => {
			const hour = new Date(timeStr).getHours();
			const formattedHour = `${hour % 12 || 12}${hour >= 12 ? "PM" : "AM"}`;
			const dayIndex = new Date(timeStr).getDay();
			const day = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			][dayIndex];
			return `${formattedHour} on ${day}s`;
		},
		info: "You watched most videos at",
	},

	{
		stat: "Videos watched by time",
		func: (timeStr: string) => {
			// return month
			const month = new Date(timeStr).getMonth();
			return [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			][month];
		},
		info: "You watched most videos this year in",
	},
];
