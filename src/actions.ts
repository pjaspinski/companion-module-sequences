import { CompanionActions } from "../../../instance_skel_types";
import SequencesInstance from "./index";
import { generateSequencesDropdown } from "./helpers";

const getActions = (instance: SequencesInstance) => {
    const dropdown = generateSequencesDropdown(instance.getSequences());

    const actions: CompanionActions = {
        playPause: {
            label: "Play/Pause sequence",
            options: [dropdown],
            callback: event => {
                const sequenceId = event.options.sequence as string;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                instance.getSocket()?.emit("playPause", sequenceId);
            }
        },
        stop: {
            label: "Stop sequence",
            options: [dropdown],
            callback: event => {
                const sequenceId = event.options.sequence as string;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                instance.getSocket()?.emit("stop", sequenceId);
            }
        },
        restart: {
            label: "Restart sequence",
            options: [dropdown],
            callback: event => {
                const sequenceId = event.options.sequence as string;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                instance.getSocket()?.emit("restart", sequenceId);
            }
        }
    };

    return actions;
};

export default getActions;
