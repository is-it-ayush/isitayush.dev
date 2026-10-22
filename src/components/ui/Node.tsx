import { Container } from '@src/components/ui/Container';
import { stack } from '@src/lib/utils';
import { Link as LinkIcon } from 'lucide-react';
import { Github } from '@src/components/ui/BrandIcons';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Tag } from '@src/components/ui/Tag';
import type { Project } from '@src/pages/projects';

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
        border={false}
      >
        <div className="flex flex-row w-full justify-between">
          <span className="text-xl font-semibold">{node.name}</span>
          <span className="flex flex-row items-center text-xs font-light">
            {new Date(node.timeline.from).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
            }) +
              (node.timeline.to
                ? ' ~ ' +
                  new Date(node.timeline.to).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                  })
                : '')}
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
            {node.github && (
              <Link
                href={node.github}
                target="_blank"
                className={node.website ? 'lg:min-w-[49%]' : 'w-full'}
              >
                <Container
                  row={true}
                  className="space-x-2 px-5 py-3"
                  padding={false}
                >
                  <Github size={24} />
                  <span className="text-lg font-medium">Source</span>
                </Container>
              </Link>
            )}
            {node.website && (
              <Link
                href={node.website}
                target="_blank"
                className={node.github ? 'lg:min-w-[49%]' : 'w-full'}
              >
                <Container
                  row={true}
                  className="space-x-2 px-5 py-3"
                  padding={false}
                >
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
