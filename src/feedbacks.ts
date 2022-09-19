import StreamStudioInstance from "./index";
import { CompanionFeedbacks } from "../../../instance_skel_types";
import { generateSequencesDropdown } from "./helpers";
import { play, pause, stop, restart } from "./icons";

const getFeedbacks = (instance: StreamStudioInstance) => {
    const dropdown = generateSequencesDropdown(instance.getSequences());
    const feedbacks: CompanionFeedbacks = {};
    feedbacks["sequenceStoppable"] = {
        type: "boolean",
        label: "Sequence Stoppable",
        description: "Indicates whether this sequence can be stopped",
        style: {
            color: instance.rgb(0, 0, 0),
            bgcolor: instance.rgb(255, 0, 0),
            png64: stop
        },
        options: [dropdown],
        callback: event => {
            const sequenceId = event.options.sequence as string;
            const sequence = instance.getSequenceById(sequenceId);
            console.log(
                "stoppable",
                sequence,
                !!(sequence && ["PAUSED", "RUNNING"].includes(sequence.playoutStatus.state))
            );
            return !!(sequence && ["PAUSED", "RUNNING"].includes(sequence.playoutStatus.state));
        }
    };
    feedbacks["sequenceRestartable"] = {
        type: "boolean",
        label: "Sequence Restartable",
        description: "Indicates whether this sequence can be restarted",
        style: {
            color: instance.rgb(0, 0, 0),
            bgcolor: instance.rgb(0, 128, 255),
            png64: restart
        },
        options: [dropdown],
        callback: event => {
            const sequenceId = event.options.sequence as string;
            const sequence = instance.getSequenceById(sequenceId);
            console.log(
                "restartable",
                sequence,
                !!(sequence && ["PAUSED", "RUNNING"].includes(sequence.playoutStatus.state))
            );
            return !!(sequence && ["PAUSED", "RUNNING"].includes(sequence.playoutStatus.state));
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
                return { bgcolor: instance.rgb(0, 255, 0), png64: play };
            return { bgcolor: instance.rgb(255, 255, 0), png64: pause };
        }
    };

    return feedbacks;
};

export default getFeedbacks;
