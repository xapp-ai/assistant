/*! Copyright (c) 2022, XAPP AI */
import { NameOnlyIntentRequestSlotMap, TITLES_VALUES } from "../models/requests";

import nlp from "compromise/three";
import { existsAndNotEmpty } from "stentor";
import { log } from "stentor-logger";
import { capitalize } from "lodash";
import { parseFullName } from "parse-full-name";

interface Term {
    // Original text
    text: string,
    // String in front of text
    pre: string,
    // String behind text
    post: string,
    // 
    tags: [],
    normal: string,
    index: [],
    id: string; // 'higbie|00200001R',
    chunk: string; // 'Noun',
    dirty: boolean;
}

interface People {
    text: string;
    terms: Term[];
    person: {
        firstName: string;
        lastName: string;
        honorific: string;
    }
}

/**
 * This will attempt to find the name elements (first, middle, last) in the provided string.
 * 
 * @param name 
 * @returns 
 */
export function parseNameFrom(q: string): NameOnlyIntentRequestSlotMap {
    const slots: NameOnlyIntentRequestSlotMap = {}

    const doc = nlp(q);

    const people: People[] = doc.people().json();

    if (existsAndNotEmpty(people)) {

        // first person
        const first = people[0];

        // high confidence is parsed person
        const person = first.person;

        if (person.honorific) {
            slots.title = {
                name: "title",
                value: capitalize(person.honorific) as TITLES_VALUES
            }

            const simpleHonorific = person.honorific.toLocaleLowerCase().replace(/[^a-zA-Z0-9]/g, '').trim();

            // Remove the first index of terms if it is the same
            if (first.terms[0].normal === simpleHonorific) {
                // shifting drops the first element
                first.terms.shift();
            }
        }

        let firstName = person.firstName;
        if (!firstName) {
            // should we assume this?
            const firstTerm = first.terms[0];
            firstName = firstTerm.text;
        }

        let lastName = person.lastName;
        if (!lastName && first.terms.length > 1) {
            // Check either index 1 or 2
            const secondTerm = first.terms[1];
            const thirdTerm = first.terms[2];
            if (secondTerm.text.replace(/[^a-zA-Z0-9]/g, '').length > 1) {
                lastName = secondTerm.text;
            } else {
                lastName = thirdTerm.text;
            }
        }

        if (firstName) {
            slots.first_name = {
                name: "first_name",
                value: capitalize(firstName)
            }
        }

        if (lastName) {
            slots.last_name = {
                name: "last_name",
                value: capitalize(lastName)
            }
        }
    }

    return slots;
}

/**
 * Assumed the string is a name but we are having trouble parsing it, this will split it up into
 * first, middle, last.
 * 
 * @param name 
 */
export function parseAssumingName(name: string): NameOnlyIntentRequestSlotMap {

    const slots: NameOnlyIntentRequestSlotMap = {};

    // Don't pass one word strings
    if (name.split(/\s+/).length === 1) {
        // bail
        log().warn(`#${parseAssumingName.name}() will not attempt to parse one word strings since it assumes one word strings are always the last name.`)
        return {};
    }

    const parsed = parseFullName(name);

    if (parsed.title) {
        slots.title = {
            name: "title",
            value: parsed.title as TITLES_VALUES
        }
    }

    if (parsed.first) {
        slots.first_name = {
            name: "first_name",
            value: parsed.first
        }
    }

    if (parsed.last) {
        slots.last_name = {
            name: "last_name",
            value: parsed.last
        }
    }

    if (parsed.middle) {
        slots.middle_initial = {
            name: "middle_initial",
            value: parsed.middle
        }
    }

    return slots;
}