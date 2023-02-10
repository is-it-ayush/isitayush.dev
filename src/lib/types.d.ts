import type {Technologies} from "@src/lib/utils";

export type Project = {
    name: string;
    timeline: {
        from: Date;
        to?: Date;
    };
    description: string;
    technologies: (keyof Technologies)[];
    github?: URL;
    website?: URL;
};
