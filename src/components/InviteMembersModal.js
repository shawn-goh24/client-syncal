import { AccessTokenContext, UserContext } from "@/pages/home";
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";

export default function InviteMembersModal({
  inviteMembersModal,
  setInviteMembersModal,
  selectedCalendar,
}) {
  const [email, setEmail] = useState();
  const [invitedEmails, setInvitedEmails] = useState([]);
  const accessToken = useContext(AccessTokenContext);
  const currUser = useContext(UserContext);

  const handleAddEmail = (e) => {
    e.preventDefault();
    setInvitedEmails((prev) => [...prev, email]);
    setEmail("");
  };

  const handleInvites = () => {
    sendInviteApi();
  };

  const handleClose = () => {
    setInviteMembersModal((prev) => !prev);
    setEmail("");
    setInvitedEmails([]);
  };

  const sendInviteApi = async () => {
    const res = await axios.post(
      `http://localhost:8080/calendar/invite`,
      {
        currUser: currUser,
        members: invitedEmails,
        calendar: selectedCalendar,
        inviteUrl: `http://localhost:3000/invites/${selectedCalendar.id}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res.data);
    handleClose();
  };

  return (
    <Modal isOpen={inviteMembersModal} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormLabel>Insert Email</FormLabel>
          <Flex as="form" onSubmit={handleAddEmail}>
            <Input
              placeholder="example@example.com"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Add</Button>
          </Flex>
          <Wrap>
            {invitedEmails?.map((item) => (
              <Tag
                size="md"
                key={item}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
              >
                <TagLabel>{item}</TagLabel>
                <TagCloseButton />
              </Tag>
            ))}
          </Wrap>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={handleInvites}>
            Invite
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
