import EditUserModal from "@/components/EditUserModal";
import { prisma } from "@/utils/prismaConnect";
import {
  Button,
  Flex,
  Group,
  Modal,
  PasswordInput,
  Select,
  SimpleGrid,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { User, UserLevel } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

export default function Users({ users }: { users: User[] }) {
  const [editUserModal, setEditUserModal] = useState(false); 
  const [user, setUser] = useState<User>();
  const router = useRouter()

  const removeUser = (user: User) => {
    if(!confirm(`Are you sure want to remove user ${user.name}`))return
    axios.delete(`/api/users/${user.id}`).then(()=> {
        showNotification({
            id: 'remove-user-msg',
            title: "Remove User Success!",
            color: 'green',
            message: "Member Successfully Removed"
        })
        router.replace(router.asPath)
      }).catch((err)=> {
        showNotification({
            id: 'remove-user-msg',
            title: "Remove User Failed!",
            color: 'red',
            message: err.response?.data?.message||'unknown server side error!'
        })
    })
  }

  return (
    <>
      <Head>
        <title>Manage Users</title>
      </Head>
      <Flex
        align={"flex-start"}
        justify={"flex-start"}
        mt={"sm"}
        direction={"column"}
        gap={"lg"}
      >
        <TextInput label="Search User Name" w={"100%"} />
        <Button
          ml={"auto"}
          type="button"
          component="a"
          href="/users/create"
          leftIcon={
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
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              />
            </svg>
          }
        >
          Create User
        </Button>
        <Table withBorder verticalSpacing={"md"}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.level}</td>
                  <td>
                    <Flex align={"flex-start"} gap={"sm"}>
                      <Button
                        type="button"
                        onClick={() => { 
                          setEditUserModal(true)
                          setUser(user)
                        }}
                        leftIcon={
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
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            />
                          </svg>
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        onClick={()=>removeUser(user)}
                        color={"red"}
                        leftIcon={
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        }
                      >
                        Delete
                      </Button>
                    </Flex>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Flex>
      <Modal
            size={'xl'}
            centered
            opened={editUserModal}
            onClose={() => setEditUserModal(false)}
        >
          <EditUserModal setEditUserModal={setEditUserModal} user={user} />
      </Modal>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const users = await prisma.user.findMany();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users))
    }, // will be passed to the page component as props
  };
}
