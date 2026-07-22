import React from "react";
import { Infra } from "webiny/extensions";
import { Cognito } from "@webiny/cognito";

const CMS_CERTIFICATE_ARN =
    "arn:aws:acm:us-east-1:986995923840:certificate/3c3a8360-a17b-48e7-b21f-4289383a4f22";

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
