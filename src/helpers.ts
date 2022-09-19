import { Sequence } from "sequences-types";
import { CompanionInputFieldDropdown } from "../../../instance_skel_types";

export const generateSequencesDropdown = (sequences: Sequence[]): CompanionInputFieldDropdown => {
    return {
        type: "dropdown",
        label: "Sequence",
        id: "sequence",
        default: sequences.length > 0 ? sequences[0].id : -1,
        choices: sequences.map(sequence => ({ id: sequence.id, label: sequence.name })),
        multiple: false
    };
};
