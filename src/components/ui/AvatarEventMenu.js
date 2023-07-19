import { UserContext } from "@/pages/home";
import { SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext } from "react";

export default function AvatarEventMenu({
  calendarUsers,
  setAddEventModal,
  setEditCalendarModal,
  setInviteMembersModal,
}) {
  const currUser = useContext(UserContext);

  const router = useRouter();
  return (
    <Flex alignItems="center" gap={3} zIndex={999}>
      <Tooltip
        label={
          calendarUsers?.length > 0 && (
            <Stack>
              {calendarUsers?.map((user) => (
                <Text key={user.id}>{user.name}</Text>
              ))}
            </Stack>
          )
        }
      >
        <AvatarGroup max={3}>
          {calendarUsers &&
            calendarUsers.map((user) => (
              <Avatar
                key={user.id}
                name={user && user.name}
                src={user && user.avatarUrl}
                bg="teal.500"
              />
            ))}
        </AvatarGroup>
      </Tooltip>
      <Button
        colorScheme="teal"
        onClick={() => setAddEventModal((prev) => !prev)}
      >
        Add Event
      </Button>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<SettingsIcon />}
          variant="ghost"
        />
        <MenuList>
          <MenuItem onClick={() => router.push(`/profile/${currUser.id}`)}>
            Profile Setting
          </MenuItem>
          <MenuItem onClick={() => setEditCalendarModal((prev) => !prev)}>
            Calendar Setting
          </MenuItem>
          <MenuItem onClick={() => setInviteMembersModal((prev) => !prev)}>
            Invite Members
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => router.push("/api/auth/logout")}>
            <p className="text-red-500 font-bold">Logout</p>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
