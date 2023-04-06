import DataContext from "@/utils/DataContext";
import { prisma } from "@/utils/prismaConnect";
import { Button, Card, Flex, Group, Modal, PasswordInput, SimpleGrid, Text, TextInput, Title } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { InviteCode, Kelas, User } from "@prisma/client";
import React, { useContext, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useInputState } from "@mantine/hooks";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import config from "@/utils/config";

export default function Classes({ kelas, inviteCode }:{ kelas: (Kelas & { owner: User })[], inviteCode: InviteCode }) {
  const { session } = useContext(DataContext)
  const [ user, setUser ] = useState<User>()
  const [ createClassModal, setCreateClassModal ] = useState(false)
  const [ joinClassModal, setJoinClassModal ] = useState(false)
  const [classNameInput, setClassNameInput] = useInputState('')
  const [sectionInput, setSectionInput] = useInputState('')
  const [classCodeInput, setClassCodeInput] = useInputState('')
  const router = useRouter()

  const createClass = async () => {
    await axios.post('/api/classes', {
        className: classNameInput,
        section: sectionInput
    }).then((res)=>{
        showNotification({
            id: 'create-user-msg',
            title: "User Created Successfully!",
            color: 'green',
            message: res.data?.message
        })
        setCreateClassModal(false)
        router.push(String(router.asPath))
    }).catch((err) => showNotification({
        id: 'create-user-msg',
        title: "Create User Failed!",
        color: 'red',
        message: err.response?.data?.message||err.message
    }))
  }

  return (<>
        <Head>
            <title>Classes</title>
        </Head>
        <Flex align={'flex-start'} justify={'flex-start'} mt={'sm'} direction={'column'} gap={'lg'}>
            {(session?.user.level==='STUDENT')&&<Button type="button" leftIcon={<svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>} variant='filled'>Task List</Button>}
            <Group ml={'auto'}>
                    {(session?.user.level==='SUPER_TEACHER'||session?.user.level==='TEACHER')&&<Button onClick={()=>setCreateClassModal(true)} leftIcon={<svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>} variant="filled">Create Class</Button>}
                    <Button type='button' onClick={()=>setJoinClassModal(true)} leftIcon={<svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>} variant="filled">Join Class</Button>
            </Group>
            <SimpleGrid breakpoints={[{ cols: 3, minWidth: 'xl' }, { cols: 2, minWidth: 'md' },{ cols: 1 }]} w={'100%'}>
              {kelas.map((kls)=><Card key={kls.id} component={Link} href={`/classes/${kls.id}`} shadow="sm" p="lg" radius="md" withBorder>
                  <Title color={'blue'} order={2}>{kls.className}</Title>
                  <Flex mt={'md'} direction={'column'} gap={'sm'}>
                      <Text color={'gray'}>{kls.section}</Text>
                      <Text color={'gray'}>{kls.owner.name}</Text>
                  </Flex>
              </Card>)}
            </SimpleGrid>
        </Flex>
        <Modal
            size={'xl'}
            centered
            opened={createClassModal}
            onClose={() => setCreateClassModal(false)}
        >
            <Flex direction={'column'} gap={'md'}>
                <Text size={'lg'}>Create Class</Text>
                <TextInput required value={classNameInput} onChange={setClassNameInput} label='Class Name'/>
                <TextInput required value={sectionInput} onChange={setSectionInput} label='Section'/>
                <Flex>       
                    <Button ml={'auto'} type='submit' onClick={createClass} component="a">Create</Button>
                </Flex>
            </Flex>
        </Modal>
        <Modal
            centered
            opened={joinClassModal}
            onClose={() => setJoinClassModal(false)}
        >
            <Flex direction={'column'} gap={'md'}>
                <Text size={'lg'}>Join Class</Text>
                <TextInput value={classCodeInput} onChange={setClassCodeInput} label='Class Code'/>
                <Flex>       
                    <Button ml={'auto'} href={`/api/join/${classCodeInput}`} type='submit' component="a">Join</Button>
                </Flex>
            </Flex>
        </Modal>
  </>);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.req.cookies[config.cookie_name]
    const session = await prisma.session.findFirst({
        where: {
            token,
            expire: {
                gte: new Date()
            }
        },
        include: {
            user: true
        }
    })
    const kelas = await prisma.kelas.findMany({
        where: {
            OR: [
                {
                    ownerId: session?.userId
                },
                {
                    users: {
                        some: {
                            userId: session?.userId
                        }
                    }
                }
            ]
        },
        include: {
          owner: true
        }
    })
    return{
        props: {
            kelas: JSON.parse(JSON.stringify(kelas))
        }
    }
}