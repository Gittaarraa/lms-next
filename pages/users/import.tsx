import { Button, Card, FileButton, Flex, Select, Table, TextInput, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import { read, utils } from 'xlsx'
import { levelSearch } from '@/utils/levelSearch'


export default function ImportUser() {
    const router = useRouter()
    const [file, setFile] = useState<File|null>(null)
    const [excel, setExcel] = useState([])

    const importUser = async (e: FormEvent) => {
        e.preventDefault()
        await axios.post(`/api/users`, { 
            users: excel,
            bulk: true
        }).then(()=> {
            showNotification({
                id: 'create-bulk-entity-msg',
                title: "Import Users Success!",
                color: 'green',
                message: "Users successfully imported"
            })
            router.push(String(router.query.to||"/users"))
        }).catch((err)=> {
            showNotification({
                id: 'create-bulk-entity-msg',
                title: "Import Users Failed!",
                color: 'red',
                message: err.response?.data?.message||'unknown server side error!'
            })
        })
    }

    const readExcel = async () => {
        if(!file) return setExcel([])
        const workbook = read(await file.arrayBuffer())
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        setExcel(utils.sheet_to_json(sheet))
    }

    useEffect(() => {
        readExcel()
    }, [file])

    return (<>
        <Head>
            <title>{`Import User`}</title>
        </Head>
        <Flex mb={'md'} align={'center'} justify={'space-between'}>
            <Title order={2} sx={(theme)=>({ color: 'white' })}>{`Import User`}</Title>
        </Flex>
        <Card component="form" onSubmit={importUser}>
            <Card.Section sx={()=>({ justifyContent: 'flex-end', display: 'flex' })} px={'md'} py={'sm'}>
                <FileButton accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' onChange={setFile}>{(props) => <Button {...props} color={'blue'}>{file?`Selected excel: ${file.name}`:"Select excel"}</Button>}</FileButton>
            </Card.Section>
            <Card.Section style={{ overflowX: 'auto' }} withBorder p={'md'} pt={'xs'}>
                <Table withColumnBorders>
                    <thead>
                        <tr>
                            <th>Username<span style={{ color: 'red' }}>*</span></th>
                            <th>Name<span style={{ color: 'red' }}>*</span></th>
                            <th>Password<span style={{ color: 'red' }}>*</span></th>
                            <th>Level<span style={{ color: 'red' }}>*</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {excel.map((i: any, index)=> {

                            const getExcelValue = (targetKey: string) => {
                                for (const key of Object.keys(i)) {
                                    if(key.toLocaleLowerCase()===targetKey){
                                        return i[key]
                                    }
                                }
                                return undefined
                            }

                            return <tr key={index}>
                                <td>{getExcelValue('username')}</td>
                                <td>{getExcelValue('name')}</td>
                                <td>{getExcelValue('password')}</td>
                                <td>{levelSearch.search(getExcelValue('level'))?.[0]?.item||"invalid level!"}</td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </Card.Section>
            <Card.Section withBorder sx={()=>({ justifyContent: 'flex-end', display: 'flex' })} px={'md'} py={'sm'}>
                <Button type="submit" color={'blue'}>Import</Button>
            </Card.Section>
        </Card>
    </>)
}