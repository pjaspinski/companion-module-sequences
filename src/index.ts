import instance_skel = require("../../../instance_skel");
import { CompanionSystem, CompanionConfigField } from "../../../instance_skel_types";
import getConfigFields from "./config";
import getActions from "./actions";
import getFeedbacks from "./feedbacks";

interface Config {
    ipAddress: string;
    port: number;
}

class SequencesInstance extends instance_skel<Config> {

    constructor(system: CompanionSystem, id: string, config: Config) {
        super(system, id, config);
        this.config = config;
    }

    public init(): void {
        this.status(this.STATUS_WARNING, "Connecting");
    }

    public readonly config_fields = (): CompanionConfigField[] => {
        return getConfigFields(this.REGEX_IP);
    };

    public updateConfig(config: Config): void {
        this.config = config;
    }

    public readonly destroy = (): void => {
    };

}

export = SequencesInstance;
