/*! Copyright (c) 2023, XAPP AI */

import { FetchService } from "stentor-service-fetch";

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface ChatCompletionRequest {
    model: "gpt-3.5-turbo" | "gpt-3.5-turbo-0301",
    messages: ChatMessage[];
    max_tokens?: number;
    temperature?: number;
}

export interface ChatGPTServiceProps {
    apiKey: string;
    temperature?: number;
    top_p?: number;
    n?: number;
    type?: "CHAT" | "COMPLETION";
}

export interface ChatGPTResponse {
    response: string;
    // data? 
}

/**
 * 
 * Chat Completion https://platform.openai.com/docs/guides/chat
 * 
 */
export class ChatGPTService extends FetchService implements Omit<ChatGPTServiceProps, apiKey> {

    private readonly apiKey: string;

    public readonly type: "CHAT" | "COMPLETION";

    public constructor(props: ChatGPTService) {
        super();

        this.apiKey = props.apiKey;
        this.type = props.type || "CHAT";
    }

    /**
     * https://platform.openai.com/docs/api-reference/completions/create 
     * @param system 
     * @param prompt 
     * @param history 
     */
    private completions(system: string, prompt: string, history: ChatMessage[]): Promise<ChatGPTResponse> {


    }

    /**
     * https://platform.openai.com/docs/api-reference/chat 
     * @param system 
     * @param prompt 
     * @param history 
     */
    private chatCompletion(system: string, prompt: string, history: ChatMessage[]): Promise<ChatGPTResponse> {

        const request: ChatCompletionRequest = {
            model: "gpt-3.5-turbo-0301",
            messages: [
                {
                    role: "system",
                    content: system,
                },
                ...history
            ],
            max_tokens: 150,
            temperature: 0.0,
        };


        return this.fetch("https://api.openai.com/v1/chat/completions", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`
            },
            method: "POST",
            body: JSON.stringify(request)
        });
    }

    public chat(system: string, prompt: string, history: ChatMessage[]): Promise<ChatGPTResponse> {

        const { type } = this;

        if (type === "CHAT") {
            return this.chatCompletion(system, prompt, history);
        } else {
            return this.completions(system, prompt, history);
        }

    }
}