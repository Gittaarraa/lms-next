import {
  AppShell,
  Header,
  Menu,
  ActionIcon,
  Navbar,
  Stack,
  NavLink,
  Drawer,
  Title,
  Flex,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { UserLevel } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Dispatch,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import DataContext from "../utils/DataContext";

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileDrawerState, setMobileDrawerState] = useState(false);

  return (
    <AppShell
      header={<AppHeader setMobileDrawerState={setMobileDrawerState} />}
      navbar={
        <AppNavbar
          setMobileDrawerState={setMobileDrawerState}
          mobileDrawerState={mobileDrawerState}
        />
      }
    >
      {children}
    </AppShell>
  );
}

const AppNavbar = ({
  mobileDrawerState,
  setMobileDrawerState,
}: {
  mobileDrawerState: boolean;
  setMobileDrawerState: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { session } = useContext(DataContext);
  const smallScreen = useMediaQuery("(max-width: 630px)");

  const navigate = async (
    e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string
  ) => {
    e.preventDefault();
    router.push(url);
    setMobileDrawerState(false);
  };

  if (smallScreen)
    return (
      <Drawer
        opened={mobileDrawerState}
        onClose={() => setMobileDrawerState(false)}
        title="Navigation"
        padding="md"
        size="sm"
        withinPortal={false}
        position="left"
        zIndex={2000}
      >
        <Stack p={5} spacing={3}>
          <NavLink
            component="a"
            href="/"
            onClick={(e) => navigate(e, "/")}
            style={{ borderRadius: "0.25rem" }}
            icon={
              <svg
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            }
            active={router.pathname === "/"}
            label="Home"
          />
          {session && session.user.level === "ADMIN" && (
            <NavLink
              href="/users"
              onClick={(e) => navigate(e, "/users")}
              component="a"
              style={{ borderRadius: "0.25rem" }}
              icon={
                <svg
                  width={20}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              }
              active={router.pathname.startsWith("/users")}
              label="Manage Users"
            />
          )}

          <NavLink
            href="/classes"
            onClick={(e) => navigate(e, "/classes")}
            component="a"
            style={{ borderRadius: "0.25rem" }}
            icon={
              <svg
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                />
              </svg>
            }
            active={router.pathname.startsWith("/classes")}
            label="Classes"
          />
        </Stack>
      </Drawer>
    );

  return (
    <Navbar
      styles={(theme) => ({
        root: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[0],
        },
      })}
      width={{ base: 250 }}
      height={"calc(100vh - 60px)"}
    >
      <Stack p={5} spacing={3}>
        <Link href="/" passHref legacyBehavior>
          <NavLink
            component="a"
            style={{ borderRadius: "0.25rem" }}
            icon={
              <svg
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            }
            active={router.pathname === "/"}
            label="Home"
          />
        </Link>
        {session?.user.level === "ADMIN" && (
          <Link href="/users" passHref legacyBehavior>
            <NavLink
              component="a"
              style={{ borderRadius: "0.25rem" }}
              icon={
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
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              }
              active={router.pathname.startsWith("/users")}
              label="Manage Users"
            />
          </Link>
        )}
        <Link href="/classes" passHref legacyBehavior>
          <NavLink
            component="a"
            style={{ borderRadius: "0.25rem" }}
            icon={
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                />
              </svg>
            }
            active={router.pathname.startsWith("/classes")}
            label="Classes"
          />
        </Link>
      </Stack>
    </Navbar>
  );
};

const AppHeader = ({ setMobileDrawerState }: any) => {
  const { session } = useContext(DataContext);
  const smallScreen = useMediaQuery("(max-width: 630px)");
  return (
    <Header
      px={"md"}
      style={{
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      styles={(theme) => ({ root: { backgroundColor: "#537FE7" } })}
      height={60}
    >
      {smallScreen ? (
        <ActionIcon
          onClick={() => setMobileDrawerState((prev: boolean) => !prev)}
          size={"lg"}
          color="blue"
          variant="light"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </ActionIcon>
      ) : (
        <Title sx={(theme) => ({ color: "white" })} order={1}>
          LMS IDN
        </Title>
      )}
      <Flex align={"center"} gap={"md"}>
        {!smallScreen && (
          <Text
            sx={(theme) => ({ color: "white" })}
            dangerouslySetInnerHTML={{
              __html: `${
                session?.user.name &&
                `Logged in as <b>${session.user.name}</b>`
              }`,
            }}
          ></Text>
        )}
        <Menu position="bottom-end" shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon size={"lg"} variant="subtle">
              <svg
                color="white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={20}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{`${
              session?.user.name && `Logged in as ${session.user.name}`
            }`}</Menu.Label>
            <Menu.Item
              component="a"
              href={`/api/auth/logout`}
              data-danger
              color="red"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              }
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Header>
  );
};
