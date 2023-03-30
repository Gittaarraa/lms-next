import { Button, Flex, PasswordInput, Select, Text, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { User, UserLevel } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function EditUserModal({ user, setEditUserModal }:{ user: User|undefined, setEditUserModal: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [usernameEdit, setUsernameEdit] = useInputState(user?.username)
    const [nameEdit, setNameEdit] = useInputState(user?.name)
    const [editLevel, setEditLevel] = useState<string|null>(user?.level||null)
    const router = useRouter() 

  const editUser = async () => {
    await axios.patch(`/api/users/${user?.id}`, {
        username: usernameEdit,
        name: nameEdit,
        level: editLevel
    }).then((res)=>{
        showNotification({
            id: 'edit-user-msg',
            title: "Edit User Success!",
            color: 'green',
            message: res.data?.message
        })
        setEditUserModal(false)
        router.push(String(router.asPath))
    }).catch((err) => showNotification({
        id: 'edit-user-msg',
        title: "Edit User Failed!",
        color: 'red',
        message: err.response?.data?.message||err.message
    }))
  }

  return (<>
    <Flex direction={'column'} gap={'md'}>
            <Text size={'lg'}>Edit User</Text>
            <TextInput required value={usernameEdit} onChange={setUsernameEdit} label='Username'/>
            <TextInput required value={nameEdit} onChange={setNameEdit} label='Full Name'/>
            <Select
                    label='Level'
                    data={Object.values(UserLevel).map((val)=> {
                      return { value: val, label: val }
                    })}
                    value={editLevel}
                    onChange={setEditLevel}
                    required
                    clearable
                    maxDropdownHeight={400}
                />
          </Flex>
          <Flex align={'flex-end'} justify={'flex-end'} mt={'md'} gap={"sm"}>
                <Button onClick={()=>setEditUserModal(false)} component="a" variant={'subtle'}>Close</Button>
                <Button type='submit' onClick={editUser} component="a">Submit</Button>
          </Flex>
    </>)
}
