import nl_BE from "./nl_BE/translations";
import en_US from "./en_US/translations";

export const languages = {
	en_US: "English",
	nl_BE: "Dutch",
};

export const defaultLang = "en_US";
export const showDefaultLang = false;

export const ui = {
	en_US: en_US,
	nl_BE: nl_BE,
} as const;


