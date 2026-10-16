import { Common } from '@modules/common';

export function getIntlString(hash: string, parameter: object) {
    if (parameter) return Common.IntlManager.intl.formatToPlainString(Common.IntlManager.t[`${hash}`], parameter); 
    return Common.IntlManager.intl.formatToPlainString(Common.IntlManager.t[`${hash}`]);
}