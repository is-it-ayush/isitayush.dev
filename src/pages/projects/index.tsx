import { Node } from "@src/components/ui/Node";
import { Separator } from "@src/components/ui/Separator";
import { Project } from "@src/lib/types";
import { pageAnim } from "@src/lib/utils";
import { motion } from "framer-motion";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { url } from "next-seo.config";

export default function ProjectsPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <motion.div
      initial={pageAnim.initial}
      animate={pageAnim.animate}
      exit={pageAnim.initial}
      transition={pageAnim.transition}
      className="flex flex-col gap-10 max-w-[400px] mt-10">
      <NextSeo
        title="projects."
        description="Here you'll find all the projects that I've worked on."
      />
      {data.map((project, i) => {
        return (
          <Node key={i} node={project}>
            {i !== data.length - 1 && <Separator />}
          </Node>
        );
      })}
    </motion.div>
  );
}

export const getStaticProps = async () => {
  const project_data: Project[] = [
    {
      name: "a thing.",
      timeline: {
        from: new Date(Date.UTC(2022, 10, 10)),
        to: new Date(Date.UTC(2022, 11, 4)),
      },
      technologies: ["trpc", "nextjs", "tailwind", "typescript", "react"],
      description:
        "A thing, was my first T3 project. I felt the need to create a platform where anyone could share their thoughts & ideas with the world in an anonymous way. I really love what I achieved with this project & it gave me a greater understanding of the stack that I had when I began.",
      github: new URL("https://github.com/is-it-ayush/athing/"),
      website: new URL("https://athing.vercel.app/"),
    },
    {
      name: "dimensional rift.",
      timeline: {
        from: new Date(Date.UTC(2022, 3)),
      },
      technologies: ["threejs", "javascript"],
      description:
        "Back in the summer of 2022, I really wanted to try threejs because I saw some really beautiful projects built with it. There it was, 'What if I could build my portfolio in three?'. The whole things was fun expect for when I had to work with GLSL. It was a total nightmare. I recommend you stay away from it.",
      github: new URL("https://github.com/is-it-ayush/dimensional_rift"),
      website: new URL("https://dimensional-rift.vercel.app"),
    },
    {
      name: "wethics.",
      timeline: {
        from: new Date(Date.UTC(2021, 4, 11)),
      },
      technologies: ["django", "python"],
      description:
        "Wethics is just your average weather app. This was my first web app. I learnt about API's & how to use them to display basic data on a website.",
      github: new URL("https://github.com/is-it-ayush/wethics"),
      website: new URL("https://soyouwannaknowtheweatherhuh.vercel.app/"),
    },
    {
      name: "isitayush.dev",
      timeline: {
        from: new Date(Date.UTC(2023, 1, 5)),
      },
      technologies: [
        "typescript",
        "radix",
        "shadcn",
        "nextjs",
        "tailwind",
        "react",
      ],
      description:
        "This month, I tried to create a corner on the internet that I could call mine. Here I'll showcase my projects, write blogs, share ideas. I really enjoyed working on this project & I'm proud I could put all the pieces together within two weeks.",
      github: new URL("https://github.com/is-it-ayush/isitayush.dev"),
      website: new URL(url),
    },
    {
      name: "cellular automata.",
      timeline: {
        from: new Date(Date.UTC(2023, 3, 2)),
      },
      technologies: ["p5", "typescript"],
      description:
        "There is something unique about observing emergent behaviour in a system. There is a bit of mathematical magic in it but it all boils down to a few very simple rules. This project was an attempt to implement John Conway's Game of Life with p5.js & I enjoyed every bit of it.",
      github: new URL("https://github.com/is-it-ayush/cellular-automata"),
      website: new URL("https://cellular-automaton-delta.vercel.app/"),
    },
  ];

  // sort in reverse chronology.
  project_data.sort((a, b) => {
    if (a.timeline.to && b.timeline.to) {
      return b.timeline.to.getTime() - a.timeline.to.getTime();
    } else if (a.timeline.to) {
      return b.timeline.from.getTime() - a.timeline.to.getTime();
    } else if (b.timeline.to) {
      return b.timeline.to.getTime() - a.timeline.from.getTime();
    } else {
      return b.timeline.from.getTime() - a.timeline.from.getTime();
    }
  });

  return {
    props: {
      data: project_data,
      revalidate: 60 * 60 * 24,
    },
  };
};
