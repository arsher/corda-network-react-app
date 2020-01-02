export const VALID_MAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const INVALID_MAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
export const VALID_NAMES_REGEX = /^[a-zA-Z]{2,30}\s{1}[a-z,A-z]{2,30}$/i;
export const SPECIAL_CHARS_REGEX = /['|"|=|$|,|\\]+/;
export const VALID_CITY_REGEX = /^[a-zA-Z]{3,30}$/i;
export const VALID_PHONE_REGEX = /^[0-9\-]{1,16}$/im;
export const MARKDOWN_SOURCE_BASE_URL = 'https://raw.githubusercontent.com/corda-network/corda-network.github.io/change/site-handover';
