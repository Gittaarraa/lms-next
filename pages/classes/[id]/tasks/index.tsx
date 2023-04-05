import { Button, Divider, Flex, Card, Avatar, Text, Group, Menu, ActionIcon } from '@mantine/core'
import { Kelas, Task, TaskAttachment } from '@prisma/client'
import { prisma } from "@/utils/prismaConnect";
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { useContext } from 'react'
import Link from 'next/link';
import dayjs from 'dayjs';
import DataContext from '@/utils/DataContext';

export default function Tasks({ kelas }:{ kelas: Kelas & { tasks: (Task & { attachment: TaskAttachment[] })[] }|undefined }) {
  const { session } = useContext(DataContext)

  return (<>
    <Head>
      <title>Tasks - {kelas?.className}</title>
    </Head>
    <Flex
      align={"center"}
      justify={"center"}
      direction={"column"}
      gap={"lg"}
      w={"100%"}
    >
      {(session?.user.level==='SUPER_TEACHER'||session?.user.level==='TEACHER')&&<Flex direction={'column'} w={'50%'}>
        <Button
          mr={'auto'}
          component="a"
          variant={"filled"}
          radius={'xl'}
          href={`/classes/${kelas?.id}/tasks/create`}
          leftIcon={<svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        }
        >
          Create
        </Button>
        <Divider mt={'lg'}/>
      </Flex>}
      {kelas?.tasks.map((task) => (
      <Card shadow="sm" radius={"md"} withBorder w={"50%"}>
        <Card.Section p={'sm'}>
          <Flex direction={'row'} align={'center'} justify={'space-between'}>
            <Group>
              <Avatar color='blue' radius="xl">
              <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
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
                      // onClick={() => {
                      //   setEditPostModal(true)
                      //   setPostIdEdit(post.id)
                      //   setPostNameEdit(post.sentence)
                      // }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item component="a">Delete</Menu.Item>
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
                          component={Link}
                          target={"_blank"}
                          href={`/api/${attachment.file}`}
                          radius={"md"}
                          withBorder
                        >
                          <Text>{attachment.file.split("/").pop()}</Text>
                        </Card>
                      ))}
          </Group>
        </Card.Section>
        <Card.Section p={'md'} withBorder>
          <Flex align={'flex-end'} justify={'flex-end'}>
          {(session?.user.level==='STUDENT')&&<Button
              component="a"
              variant={"filled"}
            >
              Send Assignment
            </Button>}
          {(session?.user.level==='SUPER_TEACHER'||session?.user.level==='TEACHER')&&<Button
              component="a"
              variant={"filled"}
            >
              Assignments
            </Button>}
          </Flex>
        </Card.Section>
      </Card>
    ))}
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
