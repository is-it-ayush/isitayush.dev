import { Container } from "@src/components/ui/Container";
import { stack } from "@src/lib/utils";
import { Github, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Tag } from "@src/components/ui/Tag";
import { Project } from "@src/pages/projects";

export const Node = ({
  node,
  children,
}: {
  node: Project;
  children?: ReactNode;
}) => {
  return (
    <>
      <Container
        className="space-y-2 flex-col min-w-[120px] p-5"
        hover={false}
        border={false}>
        <div className="flex flex-row w-full justify-between">
          <span className="text-xl font-semibold">{node.name}</span>
          <span className="flex flex-row items-center text-xs font-light">
            {node.timeline.from.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
            }) +
              (node.timeline.to
                ? " ~ " +
                  node.timeline.to.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                  })
                : "")}
          </span>
        </div>
        <div className="flex flex-wrap justify-start gap-2">
          {node.technologies.map((tech, i) => {
            return Object.keys(stack).includes(tech, i) ? (
              <Link key={i} href={stack[tech].url}>
                <Tag key={i}>{stack[tech].name}</Tag>
              </Link>
            ) : null;
          })}
        </div>
        <div className="flex flex-col gap-5">
          <span className="text-sm font-light">{node.description}</span>
          <div className="flex flex-col lg:flex-row gap-2">
            {node.github?.href && (
              <Link
                href={node.github?.href}
                target="_blank"
                className={node.website?.href ? "lg:min-w-[49%]" : "w-full"}>
                <Container
                  row={true}
                  className="space-x-2 px-5 py-3"
                  padding={false}>
                  <Github size={24} />
                  <span className="text-lg font-medium">Source</span>
                </Container>
              </Link>
            )}
            {node.website?.href && (
              <Link
                href={node.website?.href}
                target="_blank"
                className={node.github?.href ? "lg:min-w-[49%]" : "w-full"}>
                <Container
                  row={true}
                  className="space-x-2 px-5 py-3"
                  padding={false}>
                  <LinkIcon size={24} />
                  <span className="text-lg font-medium">Visit</span>
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
