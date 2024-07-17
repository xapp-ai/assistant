import { SalesforceService } from "@xapp/stentor-service-salesforce";
import { log } from "stentor-logger";
import { CrmResponse, ExternalLead } from "stentor-models";

/*! Copyright (c) 2024, XAPP AI */
export class TrackingCRMService extends SalesforceService {

    public async send(externalLead: ExternalLead, extras?: Record<string, unknown>): Promise<CrmResponse> {

        if (!!extras && Object.keys(extras).length > 0) {

            const rwg_token = extras.rwg_token;
            // const merchant_id = extras.merchant_id;

            if (rwg_token) {
                log().info(`Google Actions Center tracking found ${rwg_token}, sending Google`);

                // Production endpoint
                // const endpoint = "https://www.google.com/maps/conversion/collect";
                // Sandbox endpoint
                const endpoint = "https://www.google.com/maps/conversion/debug/collect";

                const partnerId = "20003016";

                const result = await fetch(endpoint, {
                    method: "POST",
                    body: JSON.stringify({
                        conversion_partner_id: partnerId,
                        rwg_token,
                        merchant_changed: 2
                    })
                }).then((response) => {
                    log().info(`Google Actions Center Response Status ${response.status}`);
                    return response.text();
                }).catch((error) => {
                    log().error(`Google Actions Center tracking failed ${error}`);
                });

                log().info(`Google Actions Center tracking result\n${result}`);
            }
        }

        log().info(`Passing through to Salesforce....`);
        try {
            return super.send(externalLead, extras);
        } catch (error) {
            log().error(`Salesforce tracking failed ${error}`);
            return {
                status: "Failure",
                message: "Salesforce tracking failed"
            }
        }
    }
}