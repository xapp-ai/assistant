/*! Copyright (c) 2024, XAPP AI */
import { Kendra } from "aws-sdk";



import { KnowledgeBaseService, KnowledgeBaseResult } from 'stentor-models';
import { StudioService, StudioServiceProps } from "stentor-service-studio";

import { KendraService } from "@xapp/stentor-service-kendra"

export interface KendraKnowledgeBaseServiceProps extends StudioServiceProps {
    indexId: string;
}

export class KendraKnowledgeBaseService extends StudioService implements KnowledgeBaseService {

    private readonly kendra: Kendra;

    private readonly indexId: string;

    public constructor(props: KendraKnowledgeBaseServiceProps) {
        super(props);

        this.indexId = props.indexId;

        if (!this.indexId) {
            throw new Error("Index ID is required for KendraKnowledgeBaseService");
        }

        this.kendra = new Kendra({
            region: "us-east-1"
        });
    }

    public async search(query: string): Promise<Pick<KnowledgeBaseResult, "documents" | "suggested">> {


        const queryResults = await this.kendra.query({
            IndexId: this.indexId,
            QueryText: query
        }).promise();

        // console.log("Kendra Query Results", queryResults);

        const results = KendraService.convertResult(queryResults);

        return results;
    }
}