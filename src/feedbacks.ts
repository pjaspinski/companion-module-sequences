import StreamStudioInstance from "./index";
import { CompanionFeedbacks } from "../../../instance_skel_types";
import { generateSequencesDropdown } from "./helpers";
import { play, pause, stop, restart } from "./icons";

const getFeedbacks = (instance: StreamStudioInstance) => {
    const dropdown = generateSequencesDropdown(instance.getSequences());
    const feedbacks: CompanionFeedbacks = {};
    feedbacks["sequenceStoppable"] = {
        type: "advanced",
        label: "Sequence Stoppable",
        description: "Indicates whether this sequence can be stopped",
        options: [dropdown],
        callback: event => {
            const sequenceId = event.options.sequence as string;
            const sequence = instance.getSequenceById(sequenceId);
            const active = !!(sequence && ["PAUSED", "RUNNING"].includes(sequence.playoutStatus.state));
            return {
                color: instance.rgb(0, 0, 0),
                bgcolor: active ? instance.rgb(255, 0, 0) : instance.rgb(0, 0, 0),
                png64: stop
            };
        }
    };
    feedbacks["sequenceRestartable"] = {
        type: "advanced",
        label: "Sequence Restartable",
        description: "Indicates whether this sequence can be restarted",
        options: [dropdown],
        callback: event => {
            const sequenceId = event.options.sequence as string;
            const sequence = instance.getSequenceById(sequenceId);
            const active = !!(sequence && ["PAUSED", "RUNNING"].includes(sequence.playoutStatus.state));
            return {
                color: instance.rgb(0, 0, 0),
                bgcolor: active ? instance.rgb(0, 128, 255) : instance.rgb(0, 0, 0),
                png64: restart
            };
        }
    };
    feedbacks["sequencePlayablePausable"] = {
        type: "advanced",
        label: "Sequence Playable/Pausable",
        description: "Indicated whether this sequence can be restarted or",
        options: [dropdown],
        callback: event => {
            const sequenceId = event.options.sequence as string;
            const sequence = instance.getSequenceById(sequenceId);
            console.log("play/pause", sequence);
            if (!sequence) return { bgcolor: instance.rgb(0, 0, 0) };
            if (["STOPPED", "PAUSED"].includes(sequence.playoutStatus.state))
                return { bgcolor: instance.rgb(0, 205, 80), png64: play };
            return { bgcolor: instance.rgb(255, 172, 28), png64: pause };
        }
    };

    return feedbacks;
};

export default getFeedbacks;
