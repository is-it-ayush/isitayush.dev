import {Project} from "@src/lib/types";
import {Container} from "@src/components/ui/Container";
import {Text} from "@src/components/ui/Text";
import {Tag} from "./Tag";
import {Link as LinkIcon, Github, Twitter} from "lucide-react";
import Link from "next/link";
import {ReactNode} from "react";

export const Node = ({node, children}: {node: Project; children?: ReactNode}) => {
    return (
        <>
            <Container className="space-y-2 flex-col min-w-[120px] p-5" hover={false} border={false}>
                <div className="flex flex-row w-full justify-between">
                    <Text size={"xl"} weight={"semibold"} ratio={1}>
                        {node.name}
                    </Text>
                    <Text size={"xs"} weight={"light"} ratio={1} className="flex flex-row items-center">
                        {node.timeline.from.toLocaleDateString("en-IN", {year: "numeric", month: "short"}) +
                            (node.timeline.to
                                ? " ~ " +
                                  node.timeline.to.toLocaleDateString("en-IN", {year: "numeric", month: "short"})
                                : "")}
                    </Text>
                </div>
                <div className="flex flex-wrap justify-start gap-2">
                    {node.technologies.map((tech, i) => {
                        return <Tag tag={tech} key={i} />;
                    })}
                </div>
                <div className="flex flex-col gap-5">
                    <Text size={"sm"} weight={"light"} ratio={1}>
                        {node.description}
                    </Text>
                    <div className="flex flex-col lg:flex-row gap-2">
                        {node.github?.href && (
                            <Link
                                href={node.github?.href}
                                target="_blank"
                                className={node.website?.href ? "lg:min-w-[49%]" : "w-full"}>
                                <Container row={true} className="space-x-2 px-5 py-3" padding={false}>
                                    <Github size={24} />
                                    <Text weight="medium" size="lg">
                                        Source
                                    </Text>
                                </Container>
                            </Link>
                        )}
                        {node.website?.href && (
                            <Link
                                href={node.website?.href}
                                target="_blank"
                                className={node.github?.href ? "lg:min-w-[49%]" : "w-full"}>
                                <Container row={true} className="space-x-2 px-5 py-3" padding={false}>
                                    <LinkIcon size={24} />
                                    <Text weight="medium" size="lg">
                                        Visit
                                    </Text>
                                </Container>
                            </Link>
                        )}
                    </div>
                </div>
            </Container>
            {children}
        </>
    );
};
