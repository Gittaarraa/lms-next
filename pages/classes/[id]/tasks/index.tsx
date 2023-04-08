import { Button, Divider, Flex, Card, Avatar, Text, Group, Menu, ActionIcon, Modal, Textarea, FileInput, TextInput } from '@mantine/core'
import { AssignmentAttachment, Kelas, Task, TaskAssignment, TaskAttachment, User } from '@prisma/client'
import { prisma } from "@/utils/prismaConnect";
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import dayjs from 'dayjs';
import DataContext from '@/utils/DataContext';
import { useDisclosure, useInputState } from '@mantine/hooks';
import { AttachmentBody } from '..';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { DatePickerInput } from '@mantine/dates';

export default function Tasks({ kelas }:{ kelas: Kelas & { tasks: (Task & {
  attachment: TaskAttachment[];
  assignment: (TaskAssignment & {
      attachment: AssignmentAttachment[];
      User: User | null;
  })[];
})[]; }|undefined }) {
  const { session } = useContext(DataContext)
  const [editTaskModal, setEditTaskModal] = useState(false); 
  const [taskTitleEdit, setTaskTitleEdit] = useInputState("");
  const [instructionEdit, setInstructionEdit] = useInputState("");
  const [task, setTask] = useState("");
  const [timeValue, setTimeValue] = useState<Date | null>(null);
  const router = useRouter()

  const deleteTask = (taskid: string) => {
    if(!confirm('Apakah anda yakin ingin menghapus task?')) return
    axios
      .delete(`/api/classes/${kelas?.id}/tasks/${taskid}`)
      .then((res) => {
        showNotification({
          id: "delete-task-msg",
          title: "Task Deleted Successfully!",
          color: "green",
          message: res.data?.message,
        });
        router.push(String(router.asPath));
      })
      .catch((err) =>
        showNotification({
          id: "delete-task-msg",
          title: "Delete Task Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  }

  const editTask = async (taskid: string) => {
    await axios
      .patch(`/api/classes/${kelas?.id}/tasks/${taskid}`, {
        title: taskTitleEdit,
        instruction: instructionEdit,
        dueDate: timeValue
      })
      .then((res) => {
        showNotification({
          id: "edit-task-msg",
          title: "Task Edited Successfully!",
          color: "green",
          message: res.data?.message,
        });
        setEditTaskModal(false)
        router.push(String(router.asPath));
      })
      .catch((err) =>
        showNotification({
          id: "edit-task-msg",
          title: "Edit Task Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  };

  const deleteAtt = (taskId: string, attId: string) => {
    axios.delete(`/api/classes/${kelas?.id}/tasks/${taskId}/attachment/${attId}`).then(()=> {
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

  return (<>
    <Head>
      <title>{`Tasks - ${kelas?.className}`}</title>
    </Head>
    <Flex
      align={"center"}
      justify={"center"}
      direction={"column"}
      gap={"lg"}
      w={"100%"}
    >
      {(session?.user.level==='SUPER_TEACHER'||session?.user.level==='TEACHER')&&<Flex direction={'column'} w={'50%'}>
        <Flex justify={'space-between'}>
          <Button
            component={Link}
            variant={"filled"}
            radius={'xl'}
            href={`/classes/${kelas?.id}`}
            leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={20}>
              <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
            }
          >
            Back
          </Button>
          <Button
            component={Link}
            variant={"filled"}
            radius={'xl'}
            href={`/classes/${kelas?.id}/tasks/create`}
            leftIcon={<svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          }
          >
            Create
          </Button>
        </Flex>
        <Divider mt={'lg'}/>
      </Flex>}
      {kelas?.tasks.map((task) => (
      <Card shadow="sm" radius={"md"} withBorder w={"50%"}>
        <Card.Section p={'sm'}>
          <Flex direction={'row'} align={'center'} justify={'space-between'}>
            <Group>
              <Avatar color='blue' radius="xl">
              <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
</svg>

              </Avatar>
              <Text>{task.title}</Text>
            </Group>
            <Group>
              <Text size={'xs'} color='gray'>{dayjs(task.createdAt).format("DD/MM HH:mm")}</Text>
              {(session?.user.level==='SUPER_TEACHER'||session?.user.level==='TEACHER')&&<Menu position="right-end" withinPortal shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon size={"lg"} variant="subtle">
                        <svg
                          width={20}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                          />
                        </svg>
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item 
                      component="a" 
                      onClick={() => {
                        setEditTaskModal(true)
                        setTask(task.id)
                      }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item component='button' onClick={()=>deleteTask(task.id)} >Delete</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>}
                  </Group>
          </Flex>
        </Card.Section>
        <Card.Section p={'md'} withBorder>
          <Text color='gray' size={'sm'}>Due date: {dayjs(task.dueDate).format("DD/MM")}</Text>
          <Text my={'md'}>{task.instruction}</Text>
          <Group spacing={"sm"}>
            {task.attachment.map((attachment) => (
              <Card
                radius={"md"}
                withBorder
              >
                <Group>
                  <Text 
                    component={Link}
                    target={"_blank"}
                    href={`/api/${attachment.file}`}>{attachment.file.split("/").pop()}</Text>
                  <ActionIcon
                    onClick={() => deleteAtt(task.id, attachment.id)}
                    size={"lg"}
                    variant="subtle"
                  >
                    <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </ActionIcon>
                </Group>
              </Card>
            ))}
          </Group>
        </Card.Section>
        <Card.Section p={'md'} withBorder>
          <Flex align={'flex-end'} justify={'flex-end'}>
          {(session?.user.level==='SUPER_TEACHER'||session?.user.level==='TEACHER')?<ListAssignmentModal task={task}/>:<SendAssigmentModal task={task}/>}
          </Flex>
        </Card.Section>
      </Card>
    ))}
    </Flex>
    <Modal
            size={'xl'}
            centered
            opened={editTaskModal}
            onClose={() => setEditTaskModal(false)}
        >
          <Flex direction={"column"} gap={"md"}>
          <Text size={"lg"}>Edit Task</Text>
          <TextInput
            required
            value={taskTitleEdit}
            onChange={setTaskTitleEdit}
            label="Title"
          />
          <TextInput
            required
            value={instructionEdit}
            onChange={setInstructionEdit}
            label="Instruction"
          />
          <DatePickerInput
            label="Due date"
            placeholder="Pick date"
            value={timeValue}
            onChange={setTimeValue}
            w={'50%'}
          />
        </Flex>
        <Flex align={"flex-end"} justify={"flex-end"} mt={"md"} gap={"sm"}>
          <Button
            onClick={() => setEditTaskModal(false)}
            component="a"
            variant={"subtle"}
          >
            Close
          </Button>
          <Button type="submit" onClick={()=>editTask(task)} component="a">
            Edit
          </Button>
        </Flex>
      </Modal>
  </>)
}

const ListAssignmentModal = ({ task }: { task: Task & {
  attachment: TaskAttachment[];
  assignment: (TaskAssignment & {
      attachment: AssignmentAttachment[];
      User: User | null;
  })[];
}; }) => {
  const [opened, { open, close }] = useDisclosure()
  return <>
  <Button
    component="button"
    variant={"filled"}
    onClick={open}
  >
    Assignments
  </Button>
  <Modal centered size={'lg'} opened={opened} onClose={close}>
    <Flex direction={"column"} gap={"md"}>
        <Text size={"lg"}>Assignment</Text>
        {task.assignment.map((assignment) => {
          return<><Divider/><Text weight={"bold"}>{assignment.text}</Text>
          <Text weight={"bold"}>Pengirim: {assignment.User?.name}</Text>
          <Group spacing={"sm"}>
            {assignment.attachment.map((attachment) => (
              <Card
                component={Link}
                target={"_blank"}
                href={`/api/${attachment.file}`}
                mt={"sm"}
                radius={"md"}
                withBorder
              >
                <Text>{attachment.file.split("/").pop()}</Text>
              </Card>
            ))}
          </Group>
          </>
        })}
      </Flex>
      <Flex align={"flex-end"} justify={"flex-end"} mt={"md"} gap={"sm"}>
        <Button
          onClick={close}
          component="button"
          variant={"subtle"}
        >
          Close
        </Button>
      </Flex>
  </Modal>
</>
}

const SendAssigmentModal = ({ task }: { task: Task & {
  attachment: TaskAttachment[];
  assignment: (TaskAssignment & {
      attachment: AssignmentAttachment[];
  })[];
}; }) => {
  const [opened, { open, close }] = useDisclosure()
  const [assignmentText, setAssignmentText] = useInputState("");
  const [fileValue, setFileValue] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<AttachmentBody[]>([]);
  const router = useRouter()
  const { session } = useContext(DataContext)

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

  const submitAssignment = () => {
    axios
      .post(`/api/classes/${router.query?.id}/tasks/${task.id}/assignment`, {
        text: assignmentText,
        attachments
      })
      .then((res) => {
        showNotification({
          id: "create-assignment-msg",
          title: "Assignment Created Successfully!",
          color: "green",
          message: res.data?.message,
        });
        router.replace(router.asPath);
      })
      .catch((err) =>
        showNotification({
          id: "create-assignment-msg",
          title: "Create Assignment Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  }

  const myAssigment = task.assignment.filter((assignment) => assignment.userId==session?.userId)
  
  return <>
    <Button
      component="button"
      variant={"filled"}
      onClick={open}
    >
      {myAssigment.length?"My Assignment":"Send Assignment"}
    </Button>
    <Modal centered size={'lg'} opened={opened} onClose={close}>
      <Flex direction={"column"} gap={"md"}>
          <Text size={"lg"}>Assignment</Text>
          {myAssigment.length?myAssigment.map((assignment) => {
            return<><Text weight={"bold"}>{assignment.text}</Text>
            <Group spacing={"sm"}>
              {assignment.attachment.map((attachment) => (
                <Card
                  component={Link}
                  target={"_blank"}
                  href={`/api/${attachment.file}`}
                  mt={"sm"}
                  radius={"md"}
                  withBorder
                >
                  <Text>{attachment.file.split("/").pop()}</Text>
                </Card>
              ))}
            </Group>
            </>
          }):<><Textarea
            label="Text"
            placeholder="Assignment text answers or description"
            value={assignmentText}
            onChange={setAssignmentText}
          />
          <FileInput
            multiple
            value={fileValue}
            onChange={setFileValue}
            placeholder="Choose file"
            label="Attachments"
          /></>}
        </Flex>
        <Flex align={"flex-end"} justify={"flex-end"} mt={"md"} gap={"sm"}>
          <Button
            onClick={close}
            component="button"
            variant={"subtle"}
          >
            Close
          </Button>
          {!myAssigment.length&&<Button onClick={submitAssignment}>
            Submit
          </Button>}
        </Flex>
    </Modal>
  </>
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
      tasks: {
        include: {
          attachment:true,
          assignment: {
            include: {
              attachment: true,
              User: true
            }
          }
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
