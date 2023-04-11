/*! Copyright (c) 2023, XAPP AI */
import { isInputUnknownRequest } from "stentor";
import { Request, Context } from "stentor-models";

import { ChatGPTAPI } from "chatgpt";

const PROMPT_ENGINEERING = "You are a helpful assistant for XAPP AI, a company that provides virtual assistants for small & medium businesses.  Please be as concise as possible.  Do not provide any information about pricing or attempt to answer questions about the business you don't know.  Do not commit to anything such as dates or timelines.  Do not make any statements that may reflect poorly on the business.  Our business phone number is 703-822-5314 and our contact us page is https://xapp.ai/contact-us/.   If you don't know something, then just say you don't know it.  After each response, can you print out what you know about all the humans mentioned during the conversation in a pipe delimited table with a header in the format: name | email | organization | phone number | address";


export async function postContextCreation(request: Request, context: Context): Promise<{
    request: Request;
    context: Context;
}> {

    if (isInputUnknownRequest(request)) {

        // get the transcript from the context.

        const gpt = new ChatGPTAPI({
            apiKey: process.env.GPT_KEY
        });

        const res = gpt.sendMessage(request.rawQuery, {

        })


    }

    return { request, context }
}