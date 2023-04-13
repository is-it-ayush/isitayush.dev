import { AgeCounter } from "@src/components/fragments/AgeCounter";
import { Container } from "@src/components/ui/Container";
import { Text } from "@src/components/ui/Text";
import { getRecentlyPlayed, pageAnim } from "@src/lib/utils";
import { motion } from "framer-motion";
import { Github, Twitter } from "lucide-react";
import { InferGetServerSidePropsType } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";

export default function AboutPage({ recentlyPlayed }: InferGetServerSidePropsType<typeof getStaticProps>) {
  return (
    <motion.div
      initial={pageAnim.initial}
      animate={pageAnim.animate}
      exit={pageAnim.initial}
      transition={pageAnim.transition}
      className="flex flex-col space-y-4 max-w-[400px] mt-10 lg:mt-0 justify-center">
      <NextSeo title="about." description="A little bit about me." />
      <Container>
        <Text weight="medium" size="xl">
          About
        </Text>
        <Text weight="light" size="sm" className="mt-2">
          Hi, I&apos;m Ayush. I do things. Sometimes I write code & the other time&apos;s I overthink. I like code,
          maths, philosophy & exurb1a vids on youtube. You can read all my blogs, thoughts & projects here.
        </Text>
      </Container>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col lg:flex-row gap-2">
          <Container className="lg:min-w-[49%]">
            <Text weight="medium" size="lg">
              Age
            </Text>
            <AgeCounter />
          </Container>
          <Container className="lg:min-w-[49%]">
            <Text weight="medium" size="lg">
              Fav. Animal
            </Text>
            <Text weight="normal" size="base">
              Cat 🖤
            </Text>
          </Container>
        </div>
        <div className="flex flex-col gap-2">
          <Container className="lg:min-w-[50%]">
            <div className="flex flex-row space-x-2 items-center justify-between">
              <Text weight="medium" size="lg" ratio={0} className="whitespace-pre">
                Last Song
              </Text>
              <div className="whitespace-pre gap-1 flex flex-row">
                {recentlyPlayed.track.artists.map((artist, index) => {
                  // Only show the first 3 artists, otherwise it gets too long. Sowwy. :<
                  if (index < 3) {
                    return (
                      <Link key={index} href={artist.external_urls.spotify} target="_blank">
                        <Text weight="normal" size="sm" className="text-gray-500">
                          {artist.name.length > 10 ? artist.name.slice(0, 10) + "..." : artist.name}
                          {index !== recentlyPlayed.track.artists.length - 1 ? ", " : ""}
                        </Text>
                      </Link>
                    );
                  }
                })}
              </div>
            </div>
            <Link href={recentlyPlayed.track.external_urls.spotify} target="_blank">
              <Text weight="normal" size="base" className="hover:underline hover:cursor-pointer italic">
                {recentlyPlayed.track?.name}
              </Text>
            </Link>
          </Container>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <Link href="https://github.com/is-it-ayush" target="_blank" className="lg:min-w-[49%]">
            <Container row={true} className="space-x-2">
              <Github size={24} />
              <Text weight="medium" size="lg">
                Github
              </Text>
            </Container>
          </Link>
          <Link href="https://twitter.com/is_it_ayush" target="_blank" className="lg:min-w-[49%]">
            <Container row={true} className="space-x-2">
              <Twitter size={24} />
              <Text weight="medium" size="lg">
                Twitter
              </Text>
            </Container>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export async function getStaticProps() {
  const recentlyPlayed: SpotifyApi.UsersRecentlyPlayedTracksResponse = await getRecentlyPlayed();
  return {
    props: {
      recentlyPlayed: recentlyPlayed.items[0]
        ? recentlyPlayed.items[0]
        : {
            track: {
              name: "My Voice",
              external_urls: {
                spotify: "https://isitayush.dev",
              },
              artists: [
                {
                  name: "Lil Ayush",
                  external_urls: {
                    spotify: "https://isitayush.dev",
                  },
                },
              ],
            },
          },
      revalidate: 60,
    },
  };
}
