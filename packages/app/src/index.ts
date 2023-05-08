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
import { StudioService } from "stentor-service-studio";
import { SalesforceService } from "@xapp/stentor-service-salesforce";

// Custom Handlers
import { QuestionAnsweringHandler } from "@xapp/question-answering-handler";
import { ContactCaptureHandler } from "@xapp/contact-capture-handler";
import { preResponseHook } from "./hooks/preResponseHook";

export async function handler(event: any, context: Context, callback: Callback<any>): Promise<void> {
    await setEnv().then().catch((error: Error) => console.error("Environment failed to load", error));


    const studioService: StudioService = new StudioService({
        appId: process.env.STUDIO_APP_ID,
        token: process.env.STUDIO_TOKEN
    });

    const llmService = new OpenAIService({
        businessDescription: "XAPP AI is a conversational AI company that provides intelligent virtual assistants for enterprise and small businesses with their home service templates."
    });

    const nlu = new XNLU({
        botId: process.env.LEX_BOT_ID,
        botAliasId: process.env.LEX_BOT_ALIAS_ID,
        llmService,
        knowledgeBaseService: studioService,
        intentMap: {
            questionAnswering: "OCSearch",
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
        .withKnowledgeBaseService(studioService, {
            // Intent ID for your fallback to determine if we call  KnowledgeBase
            matchIntentId: "InputUnknown",
            // For KnowledgeBase results we will generate a request with the following ID
            setIntentId: "OCSearch"
        })
        .withHandlers({
            // Add pre-built handlers or make custom ones!
            ContactCaptureHandler: ContactCaptureHandler,
            QuestionAnsweringHandler: QuestionAnsweringHandler
        })
        .withChannels([
            gbmChannel,
            LexV2Channel(),
            Stentor(nlu)
        ])
        .lambda();

    await assistant(event, context, callback);
}