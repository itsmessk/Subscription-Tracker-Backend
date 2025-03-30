import {Client as WorkFLowClient} from '@upstash/workflow';

import {QSTASH_TOKEN, QSTASH_URL} from "./env.js";

export const workFlowClient = new WorkFLowClient({
    token: QSTASH_TOKEN,
    url: QSTASH_URL
})