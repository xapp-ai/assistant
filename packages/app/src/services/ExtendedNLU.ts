/*! Copyright (c) 2023, XAPP AI */
import { LexServiceV2 } from "@xapp/stentor-service-lex";
import { log } from "stentor-logger";
import { NLURequestProps, NLUQueryResponse } from "stentor-models";
import { getSlotValue } from "stentor-utils";

import { parseAddress } from "../utils/address";
import { parseNameFrom, parseAssumingName } from "../utils/name";
import { tokenize } from "../utils/tokenize";

/**
 * A wrapper around LexV2 NLU that helps with gathering lead information
 */
export class ExtendedNLU extends LexServiceV2 {
    public async setContext(props: NLURequestProps): Promise<void>{
        log().info(`Setting active context: ${JSON.stringify(props)}`);
        return super.setContext(props);
    }

    public async query(q: string, props?: NLURequestProps): Promise<NLUQueryResponse> {

        const timerQuery = q.replace(/ /gm, "_");
        // eslint-disable-next-line no-console
        console.time(`NLU_QUERY_${timerQuery}`);
        const results = await super.query(q, props);
        log().debug(`Lex returned:`)
        log().debug(results);
        // eslint-disable-next-line no-console
        console.timeEnd(`NLU_QUERY_${timerQuery}`);

        const sentences = tokenize(q);
        // const multiSentence = sentences.length > 1;
        const firstSentence = sentences[0];
        // const totalTokens = firstSentence.terms.length;
        const oneSentence: boolean = sentences.length === 1;
        const threeOrLessTokens: boolean = firstSentence.terms.length < 4;
        // does it have slots
        // const totalSlots = Object.keys(results.slots || {}).length;
        // const hasSlots = totalSlots > 0;

        // Second opinion if it is an address
        if (results.intentId === "Address") {
            // get a second opinion
            const addressed = parseAddress(q);

            if (addressed) {
                results.slots = {
                    ...results.slots,
                    ...addressed
                }
            }
        }

        // If we have more tokens than we do slots for NameOnly, we should get a second opinion here.
        if (results.intentId === "NameOnly") {
            // we are going to assume it is a name here
            const named = parseAssumingName(q);
            log().debug(`Parsing assuming it is a name from NameOnly`);
            log().debug(named);

            if (named) {
                results.slots = {
                    ...results.slots,
                    ...named
                }
            }
        }

        // We want to get a second opinion on the InputUnknowns
        if (results.intentId === "InputUnknown") {
            // lets see if we can figure out a name here.
            const named = parseNameFrom(q);
            // IF
            // the parseFromName is able to grab any name component from the string
            // AND if is only once sentence of text
            // AND is three tokens (words) or less
            if ((getSlotValue(named, "first_name") || getSlotValue(named, "last_name")) && oneSentence && threeOrLessTokens) {
                log().debug(`Parsing assuming it is a name from InputUnknown`);

                // We will assume it is a name and parse as a name.
                const named = parseAssumingName(q);
                log().debug(named);
                if (named) {
                    results.type = "INTENT_REQUEST";
                    results.intentId = "NameOnly";
                    results.slots = { ...named };
                }
            }
        }

        return results;
    }
}