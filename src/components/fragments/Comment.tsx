import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/Avatar";
import type { ApiError, Comment as TComment } from "@src/pages/api/post/[slug]";
import { useSession } from "next-auth/react";
import { FormField, FormMessage, FormItem, FormControl, Form } from "@src/components/ui/Form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@src/lib/useToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFormattedTime, postData } from "@src/lib/utils";
import { Reply } from "./Reply";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Button } from "@src/components/ui/Button";

const commentItemAnimation = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
}

interface CommentProps extends HTMLMotionProps<"li"> {
  comment: TComment;
  slug: string;
}

// update comment schema; requires a form to be built.
export const CommentUpdateSchema = z.object({
  id: z.string().min(1, "Id should be atleast 1 character long."),
  text: z.string().min(2, "Comment should be atleast 2 characters long."),
  slug: z.string().min(1, "Slug should be atleast 1 character long."),
});
type CommentUpdateSchema = z.infer<typeof CommentUpdateSchema>;

// delete comment schema
export const CommentDeleteSchema = z.object({
  id: z.string().min(1, "Id should be atleast 1 character long."),
  slug: z.string().min(1, "Slug should be atleast 1 character long."),
});
type CommentDeleteSchema = z.infer<typeof CommentDeleteSchema>;

export const ReplyCreateSchema = z.object({
  text: z.string().min(2, "Comment should be atleast 2 characters long."),
  commentId: z.string().min(1, "Comment id should be atleast 1 character long."),
});
type ReplyCreateSchema = z.infer<typeof ReplyCreateSchema>;

export const Comment = ({ comment, slug, ...rest }: CommentProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const postCommentUpdateMutation = useMutation({
    mutationFn: (data: CommentUpdateSchema): Promise<ApiError<boolean>> =>
      postData(`/api/comment/update`, data),
  });
  const postCommentDeleteMutation = useMutation({
    mutationFn: (data: CommentDeleteSchema): Promise<ApiError<boolean>> =>
      postData(`/api/comment/delete`, data),
  });
  const postReplyCreateMutation = useMutation({
    mutationFn: (data: ReplyCreateSchema): Promise<ApiError<boolean>> =>
      postData(`/api/comment/reply/create`, data),
  });

  // update comment & delete comment
  const [isCommentEditing, setIsEditing] = useState(false);
  const commentUpdateForm = useForm<CommentUpdateSchema>({
    resolver: zodResolver(CommentUpdateSchema),
  });
  async function onUpdateComment(values: CommentUpdateSchema) {
    const res = await postCommentUpdateMutation.mutateAsync(values);
    if ("error" in res) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Comment updated successfully." });
      setIsEditing(false);
    }
    queryClient.invalidateQueries({ queryKey: [`/api/post/${slug}`] });
  }
  async function onDeleteComment(id: string) {
    const res = await postCommentDeleteMutation.mutateAsync({ id, slug });
    if ("error" in res) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Comment deleted successfully." });
    }
    queryClient.invalidateQueries({ queryKey: [`/api/post/${slug}`] });
  }

  // create reply & update reply
  const [isReplying, setIsReplying] = useState(false);
  const replyCreateForm = useForm<ReplyCreateSchema>({
    resolver: zodResolver(ReplyCreateSchema),
  });
  async function onCreateReply(values: ReplyCreateSchema) {
    const res = await postReplyCreateMutation.mutateAsync(values);
    if ("error" in res) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Reply posted successfully." });
      setIsReplying(false);
    }
    queryClient.invalidateQueries({ queryKey: [`/api/post/${slug}`] });
  }

  return (
    <motion.li title={getFormattedTime(new Date(comment.createdAt))} variants={commentItemAnimation} className="flex flex-row gap-4 w-full items-start" {...rest}>
      <Avatar>
        {comment.user.image ? (
          <AvatarImage
            src={comment.user.image}
            alt={`${comment.user.username}'s photo`}
          />
        ) : null}
        <AvatarFallback>{comment.user.username}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-4 justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
              <span>@{comment.user.username}</span>
              <span className="hidden lg:block text-xs text-black/70 dark:text-white/70 font-thin">{getFormattedTime(new Date(comment.createdAt))}</span>
            </div>
            {/* comment actions */}
            {session.status !== "unauthenticated" ? (
              <div className="flex flex-row gap-2">
                {
                  // reply post
                  isReplying ? (
                    <Button
                      tooltip="post reply."
                      onClick={() => {
                        onCreateReply(replyCreateForm.getValues());
                      }}
                      className="font-light"
                    >
                      post.
                    </Button>
                  ) : null
                }
                {
                  // can't reply while editing.
                  !isCommentEditing ? (
                    <Button tooltip={isReplying ? 'cancel reply.' : 'reply.'} className="font-light" onClick={() => {
                      replyCreateForm.setValue("text", "");
                      replyCreateForm.setValue("commentId", comment.id);
                      setIsReplying(!isReplying);
                    }}>{
                        // if you're replying to a comment, show reply. else show cancel.
                        isReplying ? "cancel." : "reply."
                      }</Button>)
                    : null
                }
                {
                  session.data?.user.username === comment.user.username ? (
                    <div className="flex flex-row gap-2">
                      {
                        // edit save
                        isCommentEditing ? (
                          <Button
                            tooltip="save comment."
                            onClick={() => {
                              onUpdateComment(commentUpdateForm.getValues());
                            }}
                            className="font-light"
                          >
                            save.
                          </Button>
                        ) : null
                      }
                      {
                        // can't edit a comment while replying.
                        !isReplying ? (
                          <Button
                            tooltip={isCommentEditing ? "cancel editing." : "edit comment."}
                            onClick={() => {
                              setIsEditing(!isCommentEditing);
                              commentUpdateForm.setValue("id", comment.id);
                              commentUpdateForm.setValue("text", comment.text);
                              commentUpdateForm.setValue("slug", slug);
                            }}
                            className="font-light">
                            {
                              // if you're editing a comment, show edit. else show cancel.
                              isCommentEditing
                                ? "cancel."
                                : "edit."
                            }
                          </Button>
                        ) : null
                      }
                      {
                        //  can't delete a comment while editing or replying.
                        isCommentEditing || isReplying ? null : (
                          <Button
                            tooltip="delete comment."
                            onClick={() => onDeleteComment(comment.id)}
                            className="font-light">
                            delete.
                          </Button>
                        )
                      }
                    </div>
                  ) : null
                }
              </div>
            ) : null}
          </div>
          {/* editing form */}
          {!isCommentEditing ? (
            <p className="font-light break-all">{comment.text}</p>
          ) : (
            <Form {...commentUpdateForm}>
              <form
                onSubmit={commentUpdateForm.handleSubmit(
                  onUpdateComment
                )}
                className="w-full">
                <FormField
                  control={commentUpdateForm.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          className="w-full bg-[#e8e8e8] dark:bg-black/95 border-b-2 border-white dark:border-black p-2 text-black text dark:text-white"
                          placeholder="write a comment..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </div>
        {/* replying form */}
        {
          session.status !== "unauthenticated" && isReplying ? (
            <Form {...replyCreateForm}>
              <form
                onSubmit={replyCreateForm.handleSubmit(onCreateReply)}
                className="w-full">
                <FormField
                  control={replyCreateForm.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          className="w-full bg-[#e8e8e8] dark:bg-black/95 border-b-2 border-white dark:border-black p-2 text-black text dark:text-white"
                          placeholder="write a reply..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : null
        }
        {/* replies */}
        <div className="flex flex-col gap-4">
          {
            // show replies if there are any
            comment.replies.length > 0 ? comment.replies.sort((a, b) => {
              if (a.createdAt < b.createdAt) return -1;
              if (a.createdAt > b.createdAt) return 1;
              return 0;
            }).map((reply) => (
              <Reply key={reply.id} reply={reply} commentId={comment.id} slug={slug} />
            )) : null
          }
        </div>
      </div>
    </motion.li>
  );
}

