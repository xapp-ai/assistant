/*! Copyright (c) 2022, XAPP AI */
import { log } from "stentor-logger";
import { AddressIntentRequestSlotMap } from "../models/requests";

import * as  addresser from "addresser";

/**
 * Attempts to parse an address from a string.
 * 
 * @param address
 * @returns 
 */
export function parseAddress(address: string): AddressIntentRequestSlotMap {

    const slots: AddressIntentRequestSlotMap = {};

    let addressed: addresser.IParsedAddress;

    try {
        addressed = addresser.parseAddress(address);
    } catch (e) {
        // not a valid address
        log().warn(`Unabled to parse address string "${address}"`);
        log().warn(e);
    }

    if (addressed) {
        // Pull out the zipCode
        slots.zip = {
            name: "zip",
            value: addressed.zipCode
        };

        slots.city = {
            name: "city",
            value: addressed.placeName
        };

        slots.state = {
            name: "state",
            value: addressed.stateName
        };

        slots.street_number = {
            name: "street_number",
            value: addressed.streetNumber
        };

        slots.street = {
            name: "street",
            value: addressed.addressLine1
        };

        slots.street_name = {
            name: "street_name",
            value: addressed.addressLine1.replace(addressed.streetNumber, "").trim()
        }
    }

    return slots;
}