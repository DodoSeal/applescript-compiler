declare type CueType = "Group";
// declare type GroupCueType = "CueList" | "Playlist" | "StartFirst" | "StartFirstAndEnter" | "Start Random" | "Timeline";

/**
 * QLab 5 Cue
 */
declare class Cue {
    constructor(
        cueType: CueType,
        name?: string,
        number?: number
    )

    // Readonly properties
    readonly name?: string

    // Mutable Properties
    displayName: string
    number: number
};

/**
 * QLab 5 Group Cue
 */
// declare class GroupCue extends Cue {
//     constructor(
//         groupType: GroupCueType
//     )
// };