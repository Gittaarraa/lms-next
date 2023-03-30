import { Button, Flex, PasswordInput, Select, Text, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { UserLevel } from '@prisma/client'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function CreateUser() {
  const [usernameInput, setUsernameInput] = useInputState('')
  const [passwordInput, setPasswordInput] = useInputState('')
  const [nameInput, setNameInput] = useInputState('')
  const [selectedLevel, setSelectedLevel] = useState<string|null>(null)
  const router = useRouter()

  const createUser = async () => {
    await axios.post('/api/users', {
        username: usernameInput,
        password: passwordInput,
        name: nameInput,
        level: selectedLevel
    }).then((res)=>{
        showNotification({
            id: 'create-user-msg',
            title: "User Created Successfully!",
            color: 'green',
            message: res.data?.message
        })
        router.push(String(router.query.to||"/users"))
    }).catch((err) => showNotification({
        id: 'create-user-msg',
        title: "Create User Failed!",
        color: 'red',
        message: err.response?.data?.message||err.message
    }))
  }

  return (<>
    <Head>
        <title>Create - Manage Users</title>
    </Head>
    <Flex direction={'column'} gap={'md'}>
            <Text size={'lg'}>Create User</Text>
            <TextInput required value={usernameInput} onChange={setUsernameInput} label='Username'/>
            <PasswordInput required value={passwordInput} onChange={setPasswordInput} label='Password'/>
            <TextInput required value={nameInput} onChange={setNameInput} label='Full Name'/>
            <Select
                    label='Level'
                    data={Object.values(UserLevel).map((val)=> {
                      return { value: val, label: val }
                    })}
                    value={selectedLevel}
                    onChange={setSelectedLevel}
                    required
                    clearable
                    maxDropdownHeight={400}
                />
        <Flex>       
            <Button ml={'auto'} type='submit' onClick={createUser} component="a">Create</Button>
        </Flex>
    </Flex>
    </>)
}
