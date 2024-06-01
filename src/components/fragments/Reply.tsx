import type { ApiError } from '@src/pages/api/post/[slug]';
import type { Comment } from '@src/pages/api/post/[slug]';
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/Avatar';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@src/components/ui/Form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@src/lib/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { postData, showAdminButton } from '@src/lib/utils';
import { Button } from '@src/components/ui/Button';
import type { GenericIDSchema } from './Comment';
import { format, formatDistanceToNow } from 'date-fns';

export const ReplyUpdateSchema = z.object({
  id: z.string().min(1, 'Id should be atleast 1 character long.'),
  text: z.string().min(2, 'Comment should be atleast 2 characters long.'),
  commentId: z
    .string()
    .min(1, 'Comment id should be atleast 1 character long.'),
});
type ReplyUpdateSchema = z.infer<typeof ReplyUpdateSchema>;
export const ReplyDeleteSchema = z.object({
  id: z.string().min(1, 'Id should be atleast 1 character long.'),
  commentId: z
    .string()
    .min(1, 'Comment id should be atleast 1 character long.'),
});
type ReplyDeleteSchema = z.infer<typeof ReplyDeleteSchema>;

interface ReplyProps {
  reply: Comment['replies'][number];
  commentId: string;
  slug: string;
}

export const Reply = ({ reply, commentId, slug }: ReplyProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // mutations
  const postReplyUpdateMutation = useMutation({
    mutationFn: (data: ReplyUpdateSchema): Promise<ApiError<boolean>> =>
      postData(`/api/post/comment/reply/update`, data),
  });
  const postReplyDeleteMutation = useMutation({
    mutationFn: (data: ReplyDeleteSchema): Promise<ApiError<boolean>> =>
      postData(`/api/post/comment/reply/delete`, data),
  });
  const postReplyVisibilityMutation = useMutation({
    mutationFn: (data: GenericIDSchema): Promise<ApiError<boolean>> =>
      postData(`/api/post/comment/reply/visibility/update`, data),
  });

  const [isReplyEditing, setIsReplyEditing] = useState(false);
  const replyUpdateForm = useForm<ReplyUpdateSchema>({
    resolver: zodResolver(ReplyUpdateSchema),
  });
  async function onUpdateReply(values: ReplyUpdateSchema) {
    const res = await postReplyUpdateMutation.mutateAsync(values);
    if ('error' in res) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Reply updated successfully.' });
      setIsReplyEditing(false);
    }
    queryClient.invalidateQueries({ queryKey: [`/api/post/${slug}`] });
  }
  async function onDeleteReply(replyId: string, commentId: string) {
    const res = await postReplyDeleteMutation.mutateAsync({
      id: replyId,
      commentId,
    });
    if ('error' in res) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Reply deleted successfully.' });
    }
    queryClient.invalidateQueries({ queryKey: [`/api/post/${slug}`] });
  }

  async function onToggleReplyVisibility(replyId: string) {
    const res = await postReplyVisibilityMutation.mutateAsync({ id: replyId });
    if ('error' in res) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    } else {
      toast({
        title: 'Success',
        description: 'Reply visibility toggled successfully.',
      });
    }
    queryClient.invalidateQueries({ queryKey: [`/api/post/${slug}`] });
  }

  return (
    <div
      key={reply.id}
      title={format(reply.createdAt, 'Pp')}
      data-vis={reply.visible ?? true} // visible by default
      className="flex flex-row gap-4 items-center border-2 border-transparent border-dashed data-[vis=false]:border-yellow-400"
    >
      <Avatar>
        {reply.user.image ? (
          <AvatarImage
            src={reply.user.image}
            alt={`${reply.user.username}'s photo`}
          />
        ) : null}
        <AvatarFallback>{reply.user.username}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-row gap-4 justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <span className="">@{reply.user.username}</span>
            <span className="hidden lg:block text-xs text-black/70 dark:text-white/70 font-thin">
              {formatDistanceToNow(reply.createdAt, {
                addSuffix: true,
              })}
            </span>
          </div>
          {session.status !== 'unauthenticated' ? (
            <div className="flex flex-row gap-2">
              {session.data?.user.username === reply.user.username ? (
                <div className="flex flex-row gap-2">
                  {
                    // save button if replying...
                    isReplyEditing ? (
                      <Button
                        tooltip="save reply edit."
                        className="font-light"
                        onClick={() => {
                          onUpdateReply(replyUpdateForm.getValues());
                        }}
                      >
                        save.
                      </Button>
                    ) : null
                  }
                  <Button
                    tooltip={isReplyEditing ? 'cancel reply.' : 'edit reply.'}
                    className="font-light"
                    onClick={() => {
                      setIsReplyEditing(!isReplyEditing);
                      replyUpdateForm.setValue('id', reply.id);
                      replyUpdateForm.setValue('text', reply.text);
                      replyUpdateForm.setValue('commentId', commentId);
                    }}
                  >
                    {isReplyEditing ? 'cancel.' : 'edit.'}
                  </Button>
                  {
                    // can't delete a reply while editing.
                    !isReplyEditing ? (
                      <Button
                        tooltip="delete reply."
                        className="font-light"
                        onClick={() => {
                          onDeleteReply(reply.id, commentId);
                        }}
                      >
                        delete.
                      </Button>
                    ) : null
                  }
                </div>
              ) : null}
              <div className="flex flex-row gap-2">
                {showAdminButton(session.data, reply.user.id) ? (
                  <Button
                    tooltip={reply.visible ? 'hide reply.' : 'show reply.'}
                    onClick={() => onToggleReplyVisibility(reply.id)}
                    className="font-light"
                  >
                    {reply.visible ? 'h.' : 's.'}
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        {/* editing reply form */}
        {!isReplyEditing ? (
          <p className="font-light">{reply.text}</p>
        ) : (
          <Form {...replyUpdateForm}>
            <form
              onSubmit={replyUpdateForm.handleSubmit(onUpdateReply)}
              className="w-full"
            >
              <FormField
                control={replyUpdateForm.control}
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
    </div>
  );
};
