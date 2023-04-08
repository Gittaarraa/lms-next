import {
  ActionIcon,
  Button,
  Card,
  CardSection,
  CopyButton,
  Divider,
  FileInput,
  Flex,
  Group,
  Menu,
  Modal,
  SimpleGrid,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useHover, useInputState, useMediaQuery } from "@mantine/hooks";
import {
  ClassMate,
  InviteCode,
  Kelas,
  Post,
  PostAttachment,
  PostComment,
  Task,
  User,
} from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { prisma } from "@/utils/prismaConnect";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { IconCheck } from "@tabler/icons";
import dayjs from "dayjs";
import Link from "next/link";
import DataContext from "@/utils/DataContext";

export interface AttachmentBody {
  buf: number[];
  name: string;
}

export default function Classroom({
  kelas,
  post,
}: {
  kelas:
    | (Kelas & {
        tasks: Task[];
        owner: User;
        InviteCode: InviteCode[];
        users: (ClassMate & { user: User })[];
        posts: (Post & {
          attachment: PostAttachment[];
          Writer: User | undefined;
          comment: (PostComment & { User: User })[];
        })[];
      })
    | undefined;
  post: Post;
}) {
  const { session } = useContext(DataContext);
  const { hovered, ref }: any = useHover();
  const [editClassModal, setEditClassModal] = useState(false);
  const [createPostModal, setCreatePostModal] = useState(false);
  const [editPostModal, setEditPostModal] = useState(false)
  const [editCommentModal, setEditCommentModal] = useState(false)
  const [classNameEdit, setClassNameEdit] = useInputState(kelas?.className);
  const [sectionEdit, setSectionEdit] = useInputState(kelas?.section);
  const [postNameEdit, setPostNameEdit] = useInputState("");
  const [postIdEdit, setPostIdEdit] = useInputState("");
  const [commentNameEdit, setCommentNameEdit] = useInputState("");
  const [commentIdEdit, setCommentIdEdit] = useInputState("");
  const [postText, setPostText] = useInputState("");
  const [commentText, setCommentText] = useInputState("");
  const [fileValue, setFileValue] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<AttachmentBody[]>([]);
  const smallScreen = useMediaQuery("(max-width: 630px)");
  const router = useRouter();

  {/* APIs Here */}
  const editClass = async () => {
    await axios
      .patch(`/api/classes/${kelas?.id}`, {
        className: classNameEdit,
        section: sectionEdit,
      })
      .then((res) => {
        showNotification({
          id: "edit-class-msg",
          title: "Edit Class Success!",
          color: "green",
          message: res.data?.message,
        });
        setClassNameEdit('')
        setEditClassModal(false);
        router.push(String(router.asPath));
      })
      .catch((err) =>
        showNotification({
          id: "edit-class-msg",
          title: "Edit Class Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  };

  const deletePost = async (postId: string) => {
    if(!confirm('Apakah anda yakin ingin menghapus post?')) return
    await axios
      .delete(`/api/classes/${kelas?.id}/posts/${postId}`)
      .then((res) => {
        showNotification({
          id: "delete-post-msg",
          title: "Post Deleted Successfully!",
          color: "green",
          message: res.data?.message,
        });
        router.push(String(router.asPath));
      })
      .catch((err) =>
        showNotification({
          id: "delete-post-msg",
          title: "Delete Post Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  };

  const createPost = async () => {
    await axios
      .post(`/api/classes/${kelas?.id}/posts`, {
        sentence: postText,
        attachments,
      })
      .then((res) => {
        showNotification({
          id: "create-post-msg",
          title: "Post Created Successfully!",
          color: "green",
          message: res.data?.message,
        });
        setPostText('')
        setCreatePostModal(false);
        router.push(String(router.asPath));
      })
      .catch((err) =>
        showNotification({
          id: "create-post-msg",
          title: "Create Post Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  };

  const editPost = async (postId: string) => {
    await axios
      .patch(`/api/classes/${kelas?.id}/posts/${postId}/`, {
        sentence: postNameEdit,
      })
      .then((res) => {
        showNotification({
          id: "edit-post-msg",
          title: "Post Edited Successfully!",
          color: "green",
          message: res.data?.message,
        });
        setPostNameEdit('')
        setEditPostModal(false)
        router.push(String(router.asPath));
      })
      .catch((err) =>
        showNotification({
          id: "edit-post-msg",
          title: "Edit Post Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  };

  const editComment = async (postId: string, commentId: String) => {
    await axios
      .patch(`/api/classes/${kelas?.id}/posts/${postId}/comment/${commentId}`, {
        text: commentNameEdit,
      })
      .then((res) => {
        showNotification({
          id: "edit-comment-msg",
          title: "Comment Edited Successfully!",
          color: "green",
          message: res.data?.message,
        });
        setCommentNameEdit('')
        setEditCommentModal(false)
        router.push(String(router.asPath));
      })
      .catch((err) =>
        showNotification({
          id: "edit-comment-msg",
          title: "Edit Comment Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  };

  const createComment = async (postId: string) => {
    await axios
      .post(`/api/classes/${kelas?.id}/posts/${postId}/comment`, {
        text: commentText,
      })
      .then((res) => {
        showNotification({
          id: "create-comment-msg",
          title: "Comment Created Successfully!",
          color: "green",
          message: res.data?.message,
        });
        setCommentText('')
        router.push(String(router.asPath));
      })
      .catch((err) =>
        showNotification({
          id: "create-comment-msg",
          title: "Create Comment Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  };

  const deleteComment = (postId: string, commentId: string) => {
    axios.delete(`/api/classes/${kelas?.id}/posts/${postId}/comment/${commentId}`).then(()=> {
        showNotification({
            id: 'delete-comment-msg',
            title: "Delete Comment Success!",
            color: 'green',
            message: "Comment Successfully Deleted"
        })
        router.replace(router.asPath)
      }).catch((err)=> {
        showNotification({
            id: 'delete-comment-msg',
            title: "Delete Comment Failed!",
            color: 'red',
            message: err.response?.data?.message||'unknown server side error!'
        })
    })
  }

  const deleteAtt = (postId: string, attId: string) => {
    axios.delete(`/api/classes/${kelas?.id}/posts/${postId}/attachment/${attId}`).then(()=> {
        showNotification({
            id: 'delete-att-msg',
            title: "Delete Attachment Success!",
            color: 'green',
            message: "Attachment Successfully Deleted"
        })
        router.replace(router.asPath)
      }).catch((err)=> {
        showNotification({
            id: 'delete-att-msg',
            title: "Delete Attachment Failed!",
            color: 'red',
            message: err.response?.data?.message||'unknown server side error!'
        })
    })
  }

  useEffect(() => {
    readFile();
  }, [fileValue]);

  const readFile = async () => {
    if (!fileValue) return setAttachments([]);
    let newAttachments: AttachmentBody[] = [];
    await Promise.all(
      fileValue.map(async (file) => {
        newAttachments.push({
          buf: Array.from(new Uint8Array(await file.arrayBuffer())),
          name: file.name,
        });
      })
    );
    setAttachments(newAttachments);
  };

  return (
    <>
      <Head>
        <title>{`Classroom - ${kelas?.className}`}</title>
      </Head>
      <Flex direction={"row"} gap={"xs"}>
        <Flex
          align={"center"}
          justify={"flex-start"}
          direction={"column"}
          gap={"lg"}
          w={"100%"}
        >
          <Card
            style={{ backgroundColor: "#537FE7" }}
            shadow="sm"
            radius={"md"}
            withBorder
            w={"85%"}
          >
            <Flex justify={"space-between"} direction={"row"} w={"100%"}>
              <Flex direction={"column"} gap={"xs"}>
                <Title sx={(theme) => ({ color: "white" })}>
                  {kelas?.className}
                </Title>
                <Text sx={(theme) => ({ color: "white" })}>
                  {kelas?.section}
                </Text>
                <Text sx={(theme) => ({ color: "white" })}>
                  {kelas?.owner.name}
                </Text>
              </Flex>
              <Flex direction={"column"} gap={"xs"} align={"end"}>
              {(session?.user.level==='SUPER_TEACHER'||session?.user.level==='TEACHER')&&<Menu position="top-end" shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon size={"lg"} variant="subtle">
                      <svg
                        width={20}
                        color="white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                      </svg>
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item component="button" onClick={() => setEditClassModal(true)}>Edit Class</Menu.Item>
                    <Menu.Item
                      component={Link}
                      href={`/classes/${kelas?.id}/codes`}
                    >
                      Invitational Code
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>}
                <Button
                  component={Link}
                  variant={"filled"}
                  href={`/classes/${kelas?.id}/tasks`}
                  leftIcon={<svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                }
                >
                  {kelas?.tasks.length}
                </Button>
              </Flex>
            </Flex>
          </Card>
          {(session?.user.level==='SUPER_TEACHER'||session?.user.level==='TEACHER')&&<UnstyledButton
            onClick={() => setCreatePostModal(true)}
            ref={ref}
            w={"85%"}
          >
            <Card ref={ref} shadow="sm" radius={"md"} withBorder component="a">
              <Text color={hovered ? "blue" : "dark"}>
                Post something to your class
              </Text>
            </Card>
          </UnstyledButton>}
          {/* Posts & Comments */}
          {kelas?.posts.map((post) => (
            <Card key={post.id} shadow="sm" radius={"md"} withBorder w={"85%"}>
              <Card.Section p={"md"}>
                <Flex justify={"space-between"} direction={"row"} w={"100%"}>
                  <Flex direction={"column"}>
                    <Text weight={"bold"}>{post.Writer?.name}</Text>
                    <Text size={"sm"} color="gray">
                      {dayjs(post.createdAt).format("DD/MM HH:mm")}
                    </Text>
                    <Text mt={"sm"} size={"sm"}>
                      {post?.sentence}
                    </Text>
                    <Group spacing={"sm"}>
                      {post.attachment.map((attachment) => (
                        <Card
                          mt={"sm"}
                          radius={"md"}
                          withBorder
                        >
                          <Group>
                            <Text 
                              component={Link}
                              target={"_blank"}
                              href={`/api/${attachment.file}`}>{attachment.file.split("/").pop()}</Text>
                            {(session?.user.level==='SUPER_TEACHER'||kelas.owner.id===session?.user.id||post.Writer?.id===session?.user.id)&&<ActionIcon
                              onClick={() => deleteAtt(post.id, attachment.id)}
                              size={"lg"}
                              variant="subtle"
                            >
                              <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </ActionIcon>}
                          </Group>
                        </Card>
                      ))}
                    </Group>
                  </Flex>
                  {(session?.user.level==='SUPER_TEACHER'||kelas.owner.id===session?.user.id||post.Writer?.id===session?.user.id)&&<Menu position="top-end" shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon size={"lg"} variant="subtle">
                        <svg
                          width={20}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                          />
                        </svg>
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item 
                      component="a" 
                      onClick={() => {
                        setEditPostModal(true)
                        setPostIdEdit(post.id)
                        setPostNameEdit(post.sentence)
                      }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item onClick={()=>deletePost(post.id)}>Delete</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>}
                </Flex>
              </Card.Section>
                {post.comment.length?<Card.Section withBorder>
                    <Text color='gray' p={"lg"}>
                      {`Comments ${post.comment.length}`}
                    </Text>
                {post.comment.map((comment) => {
                  return (
                  <Flex
                    justify={"space-between"}
                    direction={"row"}
                    w={"100%"}
                    px={"xl"}
                    pb={"xl"}
                    key={comment.id}
                  >
                    <Flex direction={"column"}>
                      <Group align="center">
                        <Text size={"sm"} weight={"bold"}>
                          {comment.User.name}
                        </Text>
                        <Text size={"xs"} color="gray">
                          {dayjs(comment.createdAt).format("DD/MM HH:mm")}
                        </Text>
                      </Group>
                      <Text mt={"sm"} size={"sm"}>
                        {comment.text}
                      </Text>
                    </Flex>
                    {(session?.user.level==='SUPER_TEACHER'||kelas.owner.id===session?.user.id||comment.User.id===session?.user.id)&&<Menu position="right" shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon size={"lg"} variant="subtle">
                          <svg
                            width={20}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                            />
                          </svg>
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                      <Menu.Item 
                      component="a" 
                      onClick={() => {
                        setEditCommentModal(true)
                        setPostIdEdit(post.id)
                        setCommentIdEdit(comment.id)
                        setCommentNameEdit(comment.text)
                      }}
                      >
                        Edit
                      </Menu.Item>
                        <Menu.Item component="a" onClick={()=>deleteComment(post.id,comment.id)}>Delete</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>}
                  </Flex>
                )
              })}
              </Card.Section>:''}
              <Card.Section withBorder p={"xl"}>
                <Flex justify={"space-between"} direction={"row"} w={"100%"}>
                  <TextInput
                    placeholder="Add comment"
                    radius="xl"
                    w={"100%"}
                    value={commentText}
                    onChange={setCommentText}
                  />
                  <ActionIcon
                    onClick={() => createComment(post.id)}
                    size={"lg"}
                    variant="subtle"
                  >
                    <svg
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </ActionIcon>
                </Flex>
              </Card.Section>
            </Card>
          ))}
        </Flex>
        <Card shadow="sm" radius="md" withBorder w={"25%"}>
          <Card.Section p={"sm"} style={{ backgroundColor: "#537FE7" }}>
            <Text weight={"bold"} sx={(theme) => ({ color: "white" })}>
              Classmates
            </Text>
          </Card.Section>
          <Card.Section withBorder p={"sm"}>
            <Table verticalSpacing={"md"}>
              <tbody>
                {kelas?.users.map((classMate) => {
                  return (
                    <tr key={classMate.user.id}>
                      <td>{classMate.user.name}</td>
                      <td>{classMate.user.level}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Section>
        </Card>
      </Flex>
      {/* Modals Here */}
      <Modal
        size={"xl"}
        centered
        opened={editClassModal}
        onClose={() => setEditClassModal(false)}
      >
        <Flex direction={"column"} gap={"md"}>
          <Text size={"lg"}>Edit Class</Text>
          <TextInput
            required
            value={classNameEdit}
            onChange={setClassNameEdit}
            label="Class Name"
          />
          <TextInput
            required
            value={sectionEdit}
            onChange={setSectionEdit}
            label="Section"
          />
        </Flex>
        <Flex align={"flex-end"} justify={"flex-end"} mt={"md"} gap={"sm"}>
          <Button
            onClick={() => setEditClassModal(false)}
            component="a"
            variant={"subtle"}
          >
            Close
          </Button>
          <Button type="submit" onClick={editClass} component="a">
            Edit
          </Button>
        </Flex>
      </Modal>
      <Modal
        size={"xl"}
        centered
        opened={createPostModal}
        onClose={() => setCreatePostModal(false)}
      >
        <Flex direction={"column"} gap={"md"}>
          <Text size={"lg"}>Post</Text>
          <Textarea
            placeholder="Text something to your class"
            value={postText}
            onChange={setPostText}
          />
          <FileInput
            multiple
            value={fileValue}
            onChange={setFileValue}
            placeholder="Choose file"
            label="Attachment"
            w={"50%"}
          />
        </Flex>
        <Flex align={"flex-end"} justify={"flex-end"} mt={"md"} gap={"sm"}>
          <Button
            onClick={() => setCreatePostModal(false)}
            component="a"
            variant={"subtle"}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={createPost} component="a">
            Post
          </Button>
        </Flex>
      </Modal>
      <Modal
            size={'xl'}
            centered
            opened={editPostModal}
            onClose={() => setEditPostModal(false)}
        >
          <Flex direction={"column"} gap={"md"}>
          <Text size={"lg"}>Edit Post</Text>
          <TextInput
            required
            value={postNameEdit}
            onChange={setPostNameEdit}
            label="Sentence"
          />
        </Flex>
        <Flex align={"flex-end"} justify={"flex-end"} mt={"md"} gap={"sm"}>
          <Button
            onClick={() => setEditPostModal(false)}
            component="a"
            variant={"subtle"}
          >
            Close
          </Button>
          <Button type="submit" onClick={() => editPost(postIdEdit)} component="a">
            Edit
          </Button>
        </Flex>
      </Modal>
      <Modal
            size={'xl'}
            centered
            opened={editCommentModal}
            onClose={() => setEditCommentModal(false)}
        >
          <Flex direction={"column"} gap={"md"}>
          <Text size={"lg"}>Edit Post</Text>
          <TextInput
            required
            value={commentNameEdit}
            onChange={setCommentNameEdit}
            label="Sentence"
          />
        </Flex>
        <Flex align={"flex-end"} justify={"flex-end"} mt={"md"} gap={"sm"}>
          <Button
            onClick={() => setEditCommentModal(false)}
            component="a"
            variant={"subtle"}
          >
            Close
          </Button>
          <Button type="submit" onClick={() => editComment(postIdEdit, commentIdEdit)} component="a">
            Edit
          </Button>
        </Flex>
      </Modal>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let kelas = await prisma.kelas.findFirst({
    where: {
      id: String(ctx.params?.id),
    },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      owner: true,
      InviteCode: true,
      tasks: true,
      posts: {
        include: {
          attachment: true,
          Writer: true,
          comment: {
            include: {
              User: true,
            },
          },
        },
      },
    },
  });

  if (!kelas)
    return {
      notFound: true,
    };

  return {
    props: {
      kelas: JSON.parse(JSON.stringify(kelas)),
    }, // will be passed to the page component as props
  };
}
