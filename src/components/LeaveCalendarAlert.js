import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, { useRef } from "react";

export default function LeaveCalendarAlert({
  leaveAlertDialog,
  setLeaveAlertDialog,
  selectedCalendar,
  handleLeaveCalendar,
}) {
  const leaveCancelRef = useRef();
  return (
    <AlertDialog
      isOpen={leaveAlertDialog}
      leastDestructiveRef={leaveCancelRef}
      onClose={() => {
        setLeaveAlertDialog((prev) => !prev);
      }}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Leave {selectedCalendar?.name}</AlertDialogHeader>
          <AlertDialogBody>Are you sure you want to leave?</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={leaveCancelRef}
              onClick={() => {
                setLeaveAlertDialog((prev) => !prev);
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleLeaveCalendar} ml={3}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
