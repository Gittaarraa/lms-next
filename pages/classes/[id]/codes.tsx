import { Divider, Flex, Table, Text } from '@mantine/core'
import { InviteCode, Kelas } from '@prisma/client';
import { prisma } from "@/utils/prismaConnect";
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import React from 'react'

export default function Codes({ kelas }:{ kelas: Kelas & { InviteCode: InviteCode[] }|undefined }) {
  return (<>
    <Head>
        <title>Invitational Code - {kelas?.className}</title>
    </Head>
    <Flex direction={'column'} gap={'md'}>
        <Text size={'xl'} weight={'bold'}>Invitational Code</Text>
        <Text>Invitational code list, you can use any one</Text>
        <Divider/>
        <Table verticalSpacing={"md"}>
          <tbody>
              {kelas?.InviteCode.map((inviteCode) => {
                return (
                  <tr>
                    <td>{inviteCode.code}</td>
                  </tr>
                );
                })}
          </tbody>
        </Table>
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
