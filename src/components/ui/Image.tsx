import { AnimatePresence, motion } from "framer-motion";
import NextImage, { ImageProps } from "next/image";
import React from "react";
import { Tag } from "@src/components/ui/Tag";
import { Text } from "./Text";

const magnifyAnim = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  transition: {
    duration: 0.2,
  },
};

const magifyOverlayAnim = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    duration: 0.2,
  },
};

const tipAnim = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  transition: {
    duration: 0.2,
  },
};

export const Image = ({ src, alt, width, height, ...rest }: ImageProps) => {
  const [magnify, setMagnify] = React.useState(false);
  return (
    <div
      className={`flex flex-col not-prose `.concat(
        magnify ? "hover:cursor-zoom-out" : "hover:cursor-zoom-in"
      )}
      onClick={() => {
        setMagnify(!magnify);
      }}>
      <NextImage src={src} alt={alt} width={width} height={height} {...rest} />
      {alt.length > 0 && (
        <Text className="text-center not-prose text-sm w-full my-2 max-w-full text-gray-500 dark:text-gray-300">
          {alt}
        </Text>
      )}
      <AnimatePresence>
        {magnify && (
          <motion.div
            initial={magifyOverlayAnim.initial}
            animate={magifyOverlayAnim.animate}
            exit={magifyOverlayAnim.initial}
            transition={magifyOverlayAnim.transition}
            className="fixed inset-0 z-50 min-h-full p-5 bg-black/10 backdrop-filter backdrop-blur-lg flex justify-center items-center">
            <motion.div
              initial={magnifyAnim.initial}
              animate={magnifyAnim.animate}
              exit={magnifyAnim.initial}
              transition={magnifyAnim.transition}
              className="flex flex-col justify-center items-center">
              <NextImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                {...rest}
              />
              {alt.length > 0 && (
                <Text className="text-center not-prose text-sm w-full my-2 max-w-[400px] text-gray-700 dark:text-gray-300">
                  {alt}
                </Text>
              )}
            </motion.div>
            <motion.div
              initial={tipAnim.initial}
              animate={tipAnim.animate}
              exit={tipAnim.initial}
              transition={tipAnim.transition}
              className="absolute bottom-5 -translate-x-[50%] w-full px-3 py-2">
              <div className="flex flex-col items-start md:items-center md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full">
                <div className="flex justify-center items-center">
                  <Tag>Tip</Tag>
                </div>
                <div className="flex justify-center items-center">
                  <Text className="not-prose text-sm text-gray-500 dark:text-gray-300 w-full">
                    You can zoom by pinching on mobile devices. On Desktop, I
                    recommend opening the image in a new tab.
                  </Text>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
