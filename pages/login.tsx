import { Card, Container, Flex, Title, PasswordInput, TextInput, Button, Text, BackgroundImage } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FormEvent } from "react";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";

export default function Login() {
  const [usernameInput, setUsernameInput] = useInputState("");
  const [passwordInput, setPasswordInput] = useInputState("");
  const router = useRouter();

  const onFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await axios
      .post("/api/auth/login", {
        username: usernameInput,
        password: passwordInput,
      })
      .then((res) => {
        showNotification({
          id: "login-msg",
          title: "Login Success!",
          color: "green",
          message: res.data?.message,
        });
        router.push(String(router.query.to || "/classes"));
      })
      .catch((err) =>
        showNotification({
          id: "login-msg",
          title: "Login Failed!",
          color: "red",
          message: err.response?.data?.message || err.message,
        })
      );
  };

  return (
    <>
      <Head>
        <title>Login - LMS</title>
      </Head>
      <img src="/image/idns.png" alt="" style={{ width: "100%", height: "100%", zIndex: -10, position: "absolute",}} />
      <Container>
        <Flex align={"center"} justify="center" h={"100vh"} direction={"column"}>
          <Title mb={"md"} align="center" color="white">
            LMS IDN Boarding School
          </Title>
          <Card onSubmit={(event) => onFormSubmit(event)} w={"50%"} component="form" shadow="sm" p="lg" radius="lg" withBorder >
            <Card.Section p={"md"}>
              <Title py={"sm"} align="center" >
                Login
              </Title>
              <TextInput size="md" p={"sm"} value={usernameInput} onChange={setUsernameInput} placeholder="Your username" label="Username" required />
              <PasswordInput size="md" p={"sm"} value={passwordInput} onChange={setPasswordInput} placeholder="Your password" label="Password" required />
              <Flex p={"sm"} justify={"flex-end"}>
                <Button type="submit" color={"blue"}>
                  Login
                </Button>
              </Flex>
            </Card.Section>
          </Card>
        </Flex>
      </Container>
    </>
  );
}
