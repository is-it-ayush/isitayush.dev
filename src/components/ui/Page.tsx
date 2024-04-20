import { HTMLMotionProps, motion } from "framer-motion";

export const pageAnim = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
  transition: {
    duration: 0.3,
  },
};

export const Page = ({ children, ...rest }: HTMLMotionProps<"div">) => {
  return (
    <motion.main {...pageAnim} {...rest}>
      {children}
    </motion.main>
  );
};
