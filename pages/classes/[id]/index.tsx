import {
  ActionIcon,
  Button,
  Card,
  CardSection,
  CopyButton,
  Flex,
  Group,
  Menu,
  Modal,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useHover, useInputState, useMediaQuery } from "@mantine/hooks";
import { ClassMate, InviteCode, Kelas, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { prisma } from "@/utils/prismaConnect";
import React, { useState } from "react";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { IconCheck } from "@tabler/icons";


export default function Classroom({ kelas }:{ kelas: Kelas & { owner: User; InviteCode: InviteCode[]; users: (ClassMate & { user: User; })[]; }|undefined }) {
  const [mobileDrawerState, setMobileDrawerState] = useState(false);
  const { hovered, ref }:any = useHover();
  const [editClassModal, setEditClassModal] = useState(false); 
  const [classNameEdit, setClassNameEdit] = useInputState(kelas?.className)
  const [sectionEdit, setSectionEdit] = useInputState(kelas?.section)
  const smallScreen = useMediaQuery("(max-width: 630px)");
  const router = useRouter()

  const editUser = async () => {
    await axios.patch(`/api/classes/${kelas?.id}`, {
        className: classNameEdit,
        section: sectionEdit
    }).then((res)=>{
        showNotification({
            id: 'edit-class-msg',
            title: "Edit Class Success!",
            color: 'green',
            message: res.data?.message
        })
        setEditClassModal(false)
        router.push(String(router.asPath))
    }).catch((err) => showNotification({
        id: 'edit-class-msg',
        title: "Edit Class Failed!",
        color: 'red',
        message: err.response?.data?.message||err.message
    }))
  }

  return (
    <>
      <Head>
        <title>{`Classroom - ${kelas?.className}`}</title>
      </Head>
      <Flex direction={"row"} gap={'xs'}>
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
                <Title sx={(theme) => ({ color: "white" })}>{kelas?.className}</Title>
                <Text sx={(theme) => ({ color: "white" })}>{kelas?.section}</Text>
                <Text sx={(theme) => ({ color: "white" })}>{kelas?.owner.name}</Text>
              </Flex>
              <Flex direction={"column"} gap={"xs"} align={'end'}>
                <Menu position="top-end" shadow="md" width={200}>
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
                    <Menu.Item component="a">Edit Class</Menu.Item>
                    <Menu.Item component="a" href={`/classes/${kelas?.id}/codes`}>Invitational Code</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Flex>
            </Flex>
          </Card>
          <UnstyledButton ref={ref} w={"85%"}>
            <Card shadow="sm" radius={"md"} withBorder component="a">
              <Text color={hovered ? 'blue' : 'dark'}>Post something to your class</Text>
            </Card>
          </UnstyledButton>
          <Card shadow="sm" radius={"md"} withBorder w={"85%"}>
            <Card.Section p={'md'}>
            <Flex justify={"space-between"} direction={"row"} w={"100%"}>
              <Flex direction={"column"}>
                <Text weight={'bold'}>Name</Text>
                <Text size={'sm'} color="gray">created at</Text>
                <Text mt={'sm'} size={'sm'}>sentence</Text>
                <UnstyledButton mt={'sm'}>
                  <Card radius={"md"} withBorder component="a">
                    <Text>file name</Text>
                  </Card>
                </UnstyledButton>
              </Flex>
              <Menu position="top-end" shadow="md" width={200}>
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
                  <Menu.Item component="a">Edit</Menu.Item>
                  <Menu.Item component="a">Delete</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
            </Card.Section>
            <Card.Section withBorder >
            <Text color="gray" p={'lg'}>Comments</Text>
            <Flex justify={"space-between"} direction={"row"} w={"100%"} px={'xl'} pb={'xl'}>
              <Flex direction={"column"}>
                <Group align="center">
                  <Text size={'sm'} weight={'bold'}>Name</Text>
                  <Text size={'xs'} color="gray">created at</Text>
                </Group>
                <Text mt={'sm'} size={'sm'}>sentence</Text>
              </Flex>
              <Menu position="right" shadow="md" width={200}>
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
                  <Menu.Item component="a">Edit</Menu.Item>
                  <Menu.Item component="a">Delete</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
            </Card.Section>
            <Card.Section withBorder p={'xl'}>
            <Flex justify={"space-between"} direction={"row"} w={"100%"}>
              <TextInput
                placeholder="Add comment"
                radius="xl"
                w={'100%'}
              />
              <ActionIcon size={"lg"} variant="subtle">
              <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
</svg>

              </ActionIcon>
            </Flex>
            </Card.Section>
          </Card>
        </Flex>
        <Card shadow="sm" radius="md" withBorder w={"25%"}>
          <Card.Section p={"sm"} style={{ backgroundColor: "#537FE7" }}>
            <Text weight={'bold'} sx={(theme) => ({ color: "white" })}>Classmates</Text>
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
      <Modal
            size={'xl'}
            centered
            opened={editClassModal}
            onClose={() => setEditClassModal(false)}
        >
          <Flex direction={'column'} gap={'md'}>
            <Text size={'lg'}>Edit Class</Text>
            <TextInput required value={classNameEdit} onChange={setClassNameEdit} label='Class Name'/>
            <TextInput required value={sectionEdit} onChange={setSectionEdit} label='Section'/>
          </Flex>
          <Flex align={'flex-end'} justify={'flex-end'} mt={'md'} gap={"sm"}>
                <Button onClick={()=>setEditClassModal(false)} component="a" variant={'subtle'}>Close</Button>
                <Button type='submit' onClick={editUser} component="a">Submit</Button>
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
                user: true
            }
        },
        owner: true,
        InviteCode: true
    }
})

if(!kelas)return{
    notFound: true
}

  return {
    props: {
      kelas: JSON.parse(JSON.stringify(kelas))
    }, // will be passed to the page component as props
  };
}
