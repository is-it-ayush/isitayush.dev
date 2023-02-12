import {Node} from "@src/components/ui/Node";
import {Separator} from "@src/components/ui/Separator";
import {Project} from "@src/lib/types";
import {pageAnim} from "@src/lib/utils";
import {motion} from "framer-motion";
import {InferGetStaticPropsType} from "next";

export default function ProjectsPage({data}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <motion.div
            initial={pageAnim.initial}
            animate={pageAnim.animate}
            exit={pageAnim.initial}
            transition={pageAnim.transition}
            className="flex flex-col gap-10 max-w-[400px] mt-10">
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
            name: "A Thing",
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
            name: "Dimensional Rift",
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
            name: "Wethics",
            timeline: {
                from: new Date(Date.UTC(2021, 4, 11)),
            },
            technologies: ["django", "python"],
            description:
                "Wethics is just your average weather app. This was my first web app. I learnt about API's & how to use them to display basic data on a website.",
            github: new URL("https://github.com/is-it-ayush/wethics"),
            website: new URL("https://soyouwannaknowtheweatherhuh.vercel.app/"),
        },
    ];

    return {
        props: {
            data: project_data,
            revalidate: 60 * 60 * 24,
        },
    };
};
