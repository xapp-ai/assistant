/*! Copyright (c) 2023, XAPP AI */
/* This is a generated file */
import { IntentRequest, Request, RequestSlot, RequestSlotMap } from "stentor";

export type LETTERS_VALUES = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

export type QUERY_VALUES = "arrangement" | "benefit solution" | "blow shelter monk" | "difference reflection oak season stun" | "doctor work" | "face charter assertive nature" | "imagine" | "myth we deport cheque distributor" | "section lesson gasp shiver" | "us access hospital";

export type AGENT_VALUES = "agent" | "representative" | "associate" | "live person";

export type YES_VALUES = "yes" | "yeah" | "sure" | "yup";

export type TITLES_VALUES = "mr" | "mrs" | "ms" | "dr" | "esq" | "hon" | "jr" | "sir";

export type NO_VALUES = "no" | "naw" | "nope";

export interface AddressIntentRequestSlotMap extends RequestSlotMap {
    city?: RequestSlot<string>;
    state?: RequestSlot<string>;
    zip?: RequestSlot<string>;
    street_name?: RequestSlot<string>;
    street_number?: RequestSlot<string>;
}

export interface AddressIntentRequest extends IntentRequest {
    intentId: "Address";
    slots: AddressIntentRequestSlotMap;
}

export function isAddressIntentRequest(request: Request): request is AddressIntentRequest {
    return !!request && (request as IntentRequest).intentId === "Address";
}

export interface EmailIntentRequestSlotMap extends RequestSlotMap {
    email?: RequestSlot<string>;
}

export interface EmailIntentRequest extends IntentRequest {
    intentId: "Email";
    slots: EmailIntentRequestSlotMap;
}

export function isEmailIntentRequest(request: Request): request is EmailIntentRequest {
    return !!request && (request as IntentRequest).intentId === "Email";
}

export interface EmailOnlyIntentRequestSlotMap extends RequestSlotMap {
    email?: RequestSlot<string>;
}

export interface EmailOnlyIntentRequest extends IntentRequest {
    intentId: "EmailOnly";
    slots: EmailOnlyIntentRequestSlotMap;
}

export function isEmailOnlyIntentRequest(request: Request): request is EmailOnlyIntentRequest {
    return !!request && (request as IntentRequest).intentId === "EmailOnly";
}

export interface NameIntentRequestSlotMap extends RequestSlotMap {
    first_name?: RequestSlot<string>;
    last_name?: RequestSlot<string>;
    last_initial?: RequestSlot<LETTERS_VALUES>;
    middle_initial?: RequestSlot<LETTERS_VALUES>;
    first_initial?: RequestSlot<LETTERS_VALUES>;
    title?: RequestSlot<TITLES_VALUES>;
}

export interface NameIntentRequest extends IntentRequest {
    intentId: "Name";
    slots: NameIntentRequestSlotMap;
}

export function isNameIntentRequest(request: Request): request is NameIntentRequest {
    return !!request && (request as IntentRequest).intentId === "Name";
}

export interface NameOnlyIntentRequestSlotMap extends RequestSlotMap {
    first_name?: RequestSlot<string>;
    last_name?: RequestSlot<string>;
    last_initial?: RequestSlot<LETTERS_VALUES>;
    middle_initial?: RequestSlot<LETTERS_VALUES>;
    first_initial?: RequestSlot<LETTERS_VALUES>;
    title?: RequestSlot<TITLES_VALUES>;
}

export interface NameOnlyIntentRequest extends IntentRequest {
    intentId: "NameOnly";
    slots: NameOnlyIntentRequestSlotMap;
}

export function isNameOnlyIntentRequest(request: Request): request is NameOnlyIntentRequest {
    return !!request && (request as IntentRequest).intentId === "NameOnly";
}

export interface NumberOnlyIntentRequestSlotMap extends RequestSlotMap {
    number?: RequestSlot<string>;
}

export interface NumberOnlyIntentRequest extends IntentRequest {
    intentId: "NumberOnly";
    slots: NumberOnlyIntentRequestSlotMap;
}

export function isNumberOnlyIntentRequest(request: Request): request is NumberOnlyIntentRequest {
    return !!request && (request as IntentRequest).intentId === "NumberOnly";
}

export interface OCNoIntentRequestSlotMap extends RequestSlotMap {
    no?: RequestSlot<NO_VALUES>;
}

export interface OCNoIntentRequest extends IntentRequest {
    intentId: "OCNo";
    slots: OCNoIntentRequestSlotMap;
}

export function isOCNoIntentRequest(request: Request): request is OCNoIntentRequest {
    return !!request && (request as IntentRequest).intentId === "OCNo";
}

export interface OCYesIntentRequestSlotMap extends RequestSlotMap {
    yes?: RequestSlot<YES_VALUES>;
}

export interface OCYesIntentRequest extends IntentRequest {
    intentId: "OCYes";
    slots: OCYesIntentRequestSlotMap;
}

export function isOCYesIntentRequest(request: Request): request is OCYesIntentRequest {
    return !!request && (request as IntentRequest).intentId === "OCYes";
}

export interface PhoneNumberIntentRequestSlotMap extends RequestSlotMap {
    phone?: RequestSlot<string>;
}

export interface PhoneNumberIntentRequest extends IntentRequest {
    intentId: "PhoneNumber";
    slots: PhoneNumberIntentRequestSlotMap;
}

export function isPhoneNumberIntentRequest(request: Request): request is PhoneNumberIntentRequest {
    return !!request && (request as IntentRequest).intentId === "PhoneNumber";
}

export interface PhoneNumberOnlyIntentRequestSlotMap extends RequestSlotMap {
    phone?: RequestSlot<string>;
}

export interface PhoneNumberOnlyIntentRequest extends IntentRequest {
    intentId: "PhoneNumberOnly";
    slots: PhoneNumberOnlyIntentRequestSlotMap;
}

export function isPhoneNumberOnlyIntentRequest(request: Request): request is PhoneNumberOnlyIntentRequest {
    return !!request && (request as IntentRequest).intentId === "PhoneNumberOnly";
}

export interface RepeatIntentIntentRequest extends IntentRequest {
    intentId: "RepeatIntent";
}

export function isRepeatIntentIntentRequest(request: Request): request is RepeatIntentIntentRequest {
    return !!request && (request as IntentRequest).intentId === "RepeatIntent";
}

export interface StopIntentIntentRequest extends IntentRequest {
    intentId: "StopIntent";
}

export function isStopIntentIntentRequest(request: Request): request is StopIntentIntentRequest {
    return !!request && (request as IntentRequest).intentId === "StopIntent";
}

export interface ThanksIntentRequest extends IntentRequest {
    intentId: "Thanks";
}

export function isThanksIntentRequest(request: Request): request is ThanksIntentRequest {
    return !!request && (request as IntentRequest).intentId === "Thanks";
}

export interface ThatsAllIntentIntentRequest extends IntentRequest {
    intentId: "ThatsAllIntent";
}

export function isThatsAllIntentIntentRequest(request: Request): request is ThatsAllIntentIntentRequest {
    return !!request && (request as IntentRequest).intentId === "ThatsAllIntent";
}

export interface ByeIntentIntentRequest extends IntentRequest {
    intentId: "ByeIntent";
}

export function isByeIntentIntentRequest(request: Request): request is ByeIntentIntentRequest {
    return !!request && (request as IntentRequest).intentId === "ByeIntent";
}

export interface CancelIntentIntentRequest extends IntentRequest {
    intentId: "CancelIntent";
}

export function isCancelIntentIntentRequest(request: Request): request is CancelIntentIntentRequest {
    return !!request && (request as IntentRequest).intentId === "CancelIntent";
}

export interface HelpIntentRequestSlotMap extends RequestSlotMap {
    query?: RequestSlot<QUERY_VALUES>;
}

export interface HelpIntentRequest extends IntentRequest {
    intentId: "Help";
    slots: HelpIntentRequestSlotMap;
}

export function isHelpIntentRequest(request: Request): request is HelpIntentRequest {
    return !!request && (request as IntentRequest).intentId === "Help";
}

export interface LeadGenerationIntentRequest extends IntentRequest {
    intentId: "LeadGeneration";
}

export function isLeadGenerationIntentRequest(request: Request): request is LeadGenerationIntentRequest {
    return !!request && (request as IntentRequest).intentId === "LeadGeneration";
}

export interface OCAgentIntentRequestSlotMap extends RequestSlotMap {
    agent?: RequestSlot<AGENT_VALUES>;
    query?: RequestSlot<QUERY_VALUES>;
}

export interface OCAgentIntentRequest extends IntentRequest {
    intentId: "OCAgent";
    slots: OCAgentIntentRequestSlotMap;
}

export function isOCAgentIntentRequest(request: Request): request is OCAgentIntentRequest {
    return !!request && (request as IntentRequest).intentId === "OCAgent";
}

export interface OCSearchIntentRequest extends IntentRequest {
    intentId: "OCSearch";
}

export function isOCSearchIntentRequest(request: Request): request is OCSearchIntentRequest {
    return !!request && (request as IntentRequest).intentId === "OCSearch";
}

