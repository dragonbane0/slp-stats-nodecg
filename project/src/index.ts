import { readFileAsGameDetails } from "./lib/readFile";
import { generateStatParams } from "./lib/stats";
import { GameDetails, Stat } from "./lib/stats/types";

import { StatOption } from "./StatOptions";

const ALL_STATS: string[] = [
	Stat.INPUTS_PER_MINUTE,
	Stat.DAMAGE_PER_OPENING,
	Stat.OPENINGS_PER_KILL,
	Stat.DAMAGE_DONE,
	Stat.AVG_KILL_PERCENT,
	Stat.NEUTRAL_WINS,
	Stat.L_CANCEL,
	Stat.FIRST_BLOOD,
	Stat.EARLY_KILLS,
	Stat.LATE_DEATHS,
	Stat.SELF_DESTRUCTS,
	Stat.HIGH_DAMAGE_PUNISHES,
];

const DEFAULT_STATS = [Stat.OPENINGS_PER_KILL, Stat.DAMAGE_DONE, Stat.AVG_KILL_PERCENT, Stat.NEUTRAL_WINS];

const getDefaultStats = (extraStats: string[] = []): StatOption[] => {

    const allStats = [...DEFAULT_STATS, ...extraStats];

    const current = allStats.map((s) => ({
		statId: s,
		enabled: true,
	}));
	return validateStatOptions(current);
};

const validateStatOptions = (current: StatOption[]): StatOption[] => {
	const newItems: StatOption[] = ALL_STATS.filter(
		(statId) => !current.find((option) => option.statId === statId)
	).map((statId) => ({ statId, enabled: false }));

	// Make sure the ones we're showing are supported
	const currentItems = current.filter((c) => ALL_STATS.includes(c.statId));
	return [...currentItems, ...newItems];
};

const generateStatsList = (options: StatOption[]): string[] => {
	const statsList = options.filter((s) => s.enabled).map((s) => s.statId);
	return [Stat.KILL_MOVES, Stat.NEUTRAL_OPENER_MOVES, "", ...statsList];
};

export function computeSlpStats(files: string[], statKeys: string[] = []): any {

    let defaultStats = getDefaultStats(statKeys);
	const statOptions: StatOption[] = defaultStats;

	try {

		let data = [];

		for (let filePath of files) {
			const details = readFileAsGameDetails(filePath);
			data.push({ filename: filePath, details });
		}

		const gameDetails = data.filter((f) => f.details !== null).map((f) => f.details as GameDetails);
		const params = generateStatParams(gameDetails, generateStatsList(statOptions));

		return params;
	}
	catch (err) {
		console.error(err);
		return null;
	}
}
