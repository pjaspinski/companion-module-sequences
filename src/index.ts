import instance_skel = require("../../../instance_skel");
import { CompanionSystem, CompanionConfigField } from "../../../instance_skel_types";
import getConfigFields from "./config";
import getActions from "./actions";
import getFeedbacks from "./feedbacks";
import {
    ClientToServerEvents,
    Sequence,
    SequenceDeletedPayload,
    SequenceStatusChangedPayload,
    ServerToClientEvents
} from "sequences-types";
import { io, Socket } from "socket.io-client";
import setVariables from "./variables";

interface Config {
    ipAddress: string;
    port: number;
}

class SequencesInstance extends instance_skel<Config> {
    private socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
    private sequences: Sequence[] = [];

    constructor(system: CompanionSystem, id: string, config: Config) {
        super(system, id, config);
        this.config = config;
        this.refresh();
    }

    public init(): void {
        console.log("init", `${this.config.ipAddress}:${this.config.port}`);
        this.status(this.STATUS_WARNING, "Connecting");
        this.socket = io(`http://${this.config.ipAddress}:${this.config.port}`);

        this.socket.on("connect", () => {
            console.log("connect");
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            this.socket?.emit("getSequences", "test");
            this.status(this.STATUS_OK, "Connected");
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this.socket.on("sequences", (sequences: Sequence[]) => {
            this.sequences = sequences;
            console.log("sequences", sequences);
            this.refresh();
        });

        this.socket.on("sequenceStatusChange", (payload: SequenceStatusChangedPayload) => {
            console.log("statusChanged", payload);
            const sequenceIdx = this.sequences.findIndex(s => s.id === payload.id);
            if (sequenceIdx === -1) return;
            const oldSequence = this.sequences[sequenceIdx];
            const newSequences = [...this.sequences];
            newSequences.splice(sequenceIdx, 1, {
                ...oldSequence,
                playoutStatus: { ...oldSequence.playoutStatus, state: payload.status.state }
            });
            this.sequences = newSequences;
            console.log(newSequences);
            this.checkFeedbacks("sequenceStoppable", "sequenceRestartable", "sequencePlayablePausable");
        });

        this.socket.on("sequenceCreated", (payload: Sequence) => {
            this.sequences.push(payload);
            this.refresh();
        });

        this.socket.on("sequenceDeleted", (payload: SequenceDeletedPayload) => {
            this.sequences = this.sequences.filter(seq => seq.id === payload.id);
            this.refresh();

            const sequenceIdx = this.sequences.findIndex(s => s.id === payload.id);
            if (sequenceIdx !== -1) return;
            const oldSequence = this.sequences[sequenceIdx];

            const name = `Play/Pause label ${oldSequence.name}`;
            this.setVariable(name, undefined);
        });
    }

    public readonly config_fields = (): CompanionConfigField[] => {
        return getConfigFields(this.REGEX_IP);
    };

    public updateConfig(config: Config): void {
        this.config = config;
        this.socket?.disconnect();
        this.socket = io(`${this.config.ipAddress}:${this.config.port}`);
    }

    public readonly destroy = (): void => {
        this.status(this.STATUS_UNKNOWN, "Disconnected");
        this.socket?.disconnect();
        this.socket = undefined;
    };

    public getSocket = () => this.socket;
    public getSequences = () => this.sequences;
    public getSequenceById = (id: string) => this.sequences.find(s => s.id === id);

    private refresh = () => {
        this.setActions(getActions(this));
        this.setFeedbackDefinitions(getFeedbacks(this));
        setVariables(this);
        this.checkFeedbacks("sequenceStoppable", "sequenceRestartable", "sequencePlayablePausable");
    };
}

export = SequencesInstance;
