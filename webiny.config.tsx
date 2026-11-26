import React from "react";
import { Infra } from "webiny/extensions";
import { Cognito } from "@webiny/cognito";

// ACM certificate (us-east-1) for the admin custom domains. Kept out of the repo.
const CMS_CERTIFICATE_ARN = process.env.WEBINY_CMS_CERTIFICATE_ARN;

if (!CMS_CERTIFICATE_ARN) {
    throw new Error("WEBINY_CMS_CERTIFICATE_ARN is not set. Set it before running any Webiny command.");
}

export const Extensions = () => {
    return (
        <>
            <Infra.Aws.DefaultRegion name={"ap-southeast-2"} />
            {/* Encryption MUST always be configured for production environments. */}
            <Infra.Env.IsProd>
                <Infra.Encryption passphrase={process.env.WEBINY_ENCRYPTION_PASSPHRASE || ""} />
            </Infra.Env.IsProd>
            <Cognito />

            {/* Custom domain for the Admin panel (dev environment). */}
            <Infra.Env.Is env={"dev"}>
                <Infra.Admin.CustomDomains
                    domains={["cms.dev.jameswilliamsmusic.store"]}
                    certificateArn={CMS_CERTIFICATE_ARN}
                    sslMethod={"sni-only"}
                />
            </Infra.Env.Is>

            {/* Custom domain for the Admin panel (prod environment). */}
            <Infra.Env.Is env={"prod"}>
                <Infra.Admin.CustomDomains
                    domains={["cms.jameswilliamsmusic.store"]}
                    certificateArn={CMS_CERTIFICATE_ARN}
                    sslMethod={"sni-only"}
                />
            </Infra.Env.Is>
        </>
    );
};
