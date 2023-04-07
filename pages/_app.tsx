import { AppProps } from 'next/app';
import Head from 'next/head';
import { Container, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Kelas, Session, User } from '@prisma/client';
import DataContext from '../utils/DataContext';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [session, setSession] = useState<(Session & { user: User })>()
  const [kelas, setKelas] = useState<Kelas[]>([])
  const colorScheme = useColorScheme()
  const router = useRouter()

  useEffect(() => {
    axios.get('/api/auth/session').then((res)=>{
      if(!res.data.user)return setSession(undefined)
      setSession(res.data)
    })
  }, [router.asPath])

  return (
    <>
      <Head>
        <title>LMS IDN</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <DataContext.Provider value={{ session }}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
          <Notifications autoClose={3000} zIndex={10000} position={'top-right'}/>
          {(router.pathname=='/login'||router.pathname == "/_error")?<Component {...pageProps} />:(
            <Layout kelas={kelas}>
              <Container size={'xl'}>
                <Component {...pageProps} />
              </Container>
            </Layout>
          )}
          {/* </Notifications> */}
      </MantineProvider>
      </DataContext.Provider>
    </>
  );
}