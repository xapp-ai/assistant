/*! Copyright (c) 2020, XAPP AI */
// Loads the environment variables from a .env file at root
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

// Lambda
import { Callback, Context } from "aws-lambda";

// Assistant
import { Assistant, setEnv } from "stentor";

// Channels
import { GoogleBusinessMessages } from "@xapp/stentor-gbm";
import { LexV2Channel } from "@xapp/stentor-lex-v2";
import { Stentor } from "stentor-channel";

// NLU
import { XNLU, OpenAIService } from "@xapp/x-nlu";

// Services
import { DynamoUserStorage } from "stentor-user-storage-dynamo";
// import { StudioService } from "stentor-service-studio";
import { SalesforceService } from "@xapp/stentor-service-salesforce";

// Custom Handlers
import { QuestionAnsweringHandler } from "@xapp/question-answering-handler";
import { ContactCaptureHandler } from "@xapp/contact-capture-handler";
import { preResponseHook } from "./hooks/preResponseHook";

import { KendraKnowledgeBaseService } from "./services/KendraKnowledgeBaseService";

export async function handler(event: any, context: Context, callback: Callback<any>): Promise<void> {
    await setEnv().then().catch((error: Error) => console.error("Environment failed to load", error));

    /*
    const studioService: StudioService = new StudioService({
        appId: process.env.STUDIO_APP_ID,
        token: process.env.STUDIO_TOKEN
    }); */

    // const KB_INTENT_ID = "OCSearch";  // THis is for ASSISTANT
    const KB_INTENT_ID = "KnowledgeAnswer";

    const kbService = new KendraKnowledgeBaseService({
        appId: process.env.STUDIO_APP_ID,
        token: process.env.STUDIO_TOKEN,
        indexId: process.env.KENDRA_INDEX_ID
    });

    const llmService = new OpenAIService({
        businessDescription: "Window World 360 is a franchise that provides business coaching and consulting services for other businesses. They are located in Molalla, OR and can be reached at 1-800-NEXT-WINDOW for general inquiries, 1-866-740-2100 for customer support, and 1-800-639-8946 for sales. They offer workflow checklists, bulk product updates, data security agreements, email templates, and payment logistics integration. Contact legal@windowworld.com for legal inquiries and support@windowworld.com for customer support."
        // businessDescription: "XAPP AI is a conversational AI company that provides intelligent virtual assistants for enterprise and small businesses with their home service templates.  XAPP AI has a with deep understanding of applying conversational AI, intelligent search and generative AI to create conversational chat, search and messaging."
    });

    const nlu = new XNLU({
        botId: process.env.LEX_BOT_ID,
        botAliasId: process.env.LEX_BOT_ALIAS_ID,
        llmService,
        knowledgeBaseService: kbService,
        enableChat: true,
        intentMap: {
            questionAnswering: KB_INTENT_ID,
            helpWith: "LeadGeneration"
        }
    });

    const gbmChannel = GoogleBusinessMessages(nlu, {
        //  Customize your bot name
        botAvatarName: "Assistant"
    });

    gbmChannel.hooks = {
        preResponseTranslation: preResponseHook(nlu),
    }

    // Return the handler for running in an AWS Lambda function.
    const assistant = new Assistant()
        // We are using a simple dynamo user storage but all you need is something that implements the interface UserStorageService
        .withUserStorage(new DynamoUserStorage())
        .withCrmService(new SalesforceService(
            {
                appId: process.env.STUDIO_APP_ID,
                leadOwner: process.env.SALESFORCE_LEAD_OWNER,
                leadSource: "xappy"
            }
        ))
        .withKnowledgeBaseService(kbService, {
            // Intent ID for your fallback to determine if we call  KnowledgeBase
            matchIntentId: "InputUnknown",
            // For KnowledgeBase results we will generate a request with the following ID
            setIntentId: KB_INTENT_ID
        })
        .withHandlers({
            // Add pre-built handlers or make custom ones!
            ContactCaptureHandler: ContactCaptureHandler,
            ContactCaptureHandlerType: ContactCaptureHandler,

            QuestionAnsweringHandler: QuestionAnsweringHandler,
            QuestionAnsweringHandlerType: QuestionAnsweringHandler
        })
        .withChannels([
            gbmChannel,
            LexV2Channel(),
            Stentor(nlu)
        ])
        .lambda();

    await assistant(event, context, callback);
}