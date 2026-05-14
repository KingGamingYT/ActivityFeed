import { Common } from '@modules/common';

export function getIntlString(hash, parameter) {
    if (parameter) return Common.intl.intl.formatToPlainString(Common.intl.t[`${hash}`], parameter); 
    return Common.intl.intl.formatToPlainString(Common.intl.t[`${hash}`]);
}