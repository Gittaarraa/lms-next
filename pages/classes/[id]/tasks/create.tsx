import { Button, FileInput, Flex, PasswordInput, Select, Text, TextInput, Textarea } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates';
import { useInputState } from '@mantine/hooks';
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { AttachmentBody } from '..';
import axios from 'axios';
import { Kelas, Task, TaskAttachment } from '@prisma/client';
import { showNotification } from '@mantine/notifications';
import { prisma } from '@/utils/prismaConnect';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

export default function CreateTask({ kelas }:{ kelas: Kelas & { tasks: (Task & { attachment: TaskAttachment })[] }|undefined }) {
  const [title, setTitle] = useInputState("");
  const [instruction, setInstruction] = useInputState("");
  const [timeValue, setTimeValue] = useState<Date | null>(null);
  const [fileValue, setFileValue] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<AttachmentBody[]>([]);
  const router = useRouter()

  const createTask = async () => {
    await axios
      .post(`/api/classes/${kelas?.id}/tasks`, {
        title,
        instruction,
        attachments,
        dueDate: timeValue 
      })
      .then((res) => {
        showNotification({
          id: "create-post-msg",
          title: "Post Created Successfully!",
          color: "green",
          message: res.data?.message,
        });
        router.push(String(router.query.to||`/classes/${kelas?.id}/tasks`));
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

  return (<>
    <Head>
        <title>Create Task</title>
    </Head>
    <Flex direction={"column"} gap={"md"}>
          <Text size={"lg"}>Create Task</Text>
          <TextInput
            label="Title"
            value={title}
            onChange={setTitle}
          />
          <Textarea
            label="Instruction"
            value={instruction}
            onChange={setInstruction}
          />
          <DatePickerInput
            label="Due date"
            placeholder="Pick date"
            value={timeValue}
            onChange={setTimeValue}
            w={'50%'}
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
          <Button type="submit" onClick={createTask} component="a">
            Create
          </Button>
        </Flex>
    </>)
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
      tasks: {
        include: {
          attachment:true
        }
      }
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