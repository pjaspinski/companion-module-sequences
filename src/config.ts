import { SomeCompanionConfigField } from "../../../instance_skel_types";

const getConfigFields = (ipRegexp: string): SomeCompanionConfigField[] => [
    {
        type: "text",
        id: "info",
        width: 12,
        label: "About ports",
        value: "This module connects to the port 3001 of Sequences app, so you should use this port unless you forwarded in to another one :)"
    },
    {
        type: "textinput",
        id: "ipAddress",
        label: "IP Address",
        width: 6,
        default: "127.0.0.1",
        regex: ipRegexp
    },
    {
        type: "number",
        id: "port",
        label: "Port",
        width: 6,
        default: 3001,
        min: 1,
        max: 65535,
        step: 1
    }
];

export default getConfigFields;
