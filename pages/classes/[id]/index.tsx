import {
  ActionIcon,
  Button,
  Card,
  CardSection,
  Flex,
  Group,
  Menu,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Kelas } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { prisma } from "@/utils/prismaConnect";
import React, { useState } from "react";

export default function Classroom({ kelas }:{ kelas: Kelas|undefined }) {
  const [mobileDrawerState, setMobileDrawerState] = useState(false);
  const smallScreen = useMediaQuery("(max-width: 630px)");

  return (
    <>
      <Head>
        <title>{`Classroom - ${kelas?.className}`}</title>
      </Head>
      <Flex direction={"row"} justify={"space-between"}>
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
              </Flex>
              <ActionIcon size={"lg"} variant="subtle">
                <svg
                  color="white"
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </ActionIcon>
            </Flex>
          </Card>
          <Card shadow="sm" radius={"md"} withBorder w={"85%"}>
            <Text>Post something to your class</Text>
          </Card>
          <Card shadow="sm" radius={"md"} withBorder w={"85%"}>
            <Flex justify={"space-between"} direction={"row"} w={"100%"}>
              <Flex direction={"column"}>
                <Text weight={'bold'}>Name</Text>
                <Text size={'sm'} color="gray">created at</Text>
                <Text mt={'sm'} size={'sm'}>sentence</Text>
                <Button mt={'xs'} size={'sm'} rightIcon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height={'1rem'}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>}>Attachment</Button>
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
          </Card>
        </Flex>
        <Card shadow="sm" radius="md" withBorder w={"25%"}>
          <Card.Section p={"sm"}>
            <Text>Classmates</Text>
          </Card.Section>
          <Card.Section withBorder p={"sm"}>
            <Table verticalSpacing={"md"}>
              <tbody>
                <tr>
                  <td>(name)</td>
                  <td>(level)</td>
                </tr>
              </tbody>
            </Table>
          </Card.Section>
        </Card>
      </Flex>
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
