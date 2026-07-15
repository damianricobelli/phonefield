import type * as Utils from "../src/public-utils.js";

export type Parse = typeof Utils.parse;
export type IsValid = typeof Utils.isValid;
export type BuildValue = typeof Utils.buildValue;
export type FromFormData = typeof Utils.fromFormData;
export type ToFormValue = typeof Utils.toFormValue;
export type GetCountries = typeof Utils.getCountries;
export type Countries = typeof Utils.countries;

// @ts-expect-error Internal locale normalization is not part of phonefield/utils.
export type InternalNormalizeLang = typeof Utils.normalizeLang;
// @ts-expect-error Internal digit handling is not part of phonefield/utils.
export type InternalOnlyDigits = typeof Utils.onlyDigits;
// @ts-expect-error Internal country resolution is not part of phonefield/utils.
export type InternalResolveCountry = typeof Utils.resolveCountry;
// @ts-expect-error Use named exports (or import * as PhoneFieldUtils) instead.
export type RemovedFacade = typeof Utils.PhoneFieldUtils;
