import { CompanionVariable } from "../../../instance_skel_types";
import SequencesInstance from "./index";

const setVariables = (instance: SequencesInstance) => {
    const defs: CompanionVariable[] = [];
    const vars: { [key: string]: string } = {};

    instance.getSequences().forEach(seq => {
        const name = `Play/Pause label ${seq.name}`;

        defs.push({
            label: `Play/Pause button label for sequence ${seq.name}`,
            name
        });

        vars[name] = seq.playoutStatus.state === "RUNNING" ? "PAUSE" : "PLAY";
    });

    instance.setVariableDefinitions(defs);
    instance.setVariables(vars);
};

export default setVariables;
