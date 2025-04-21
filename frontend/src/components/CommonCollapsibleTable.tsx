// components/CommonCollapsibleTable.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Switch,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
  deleteUser,
  fetchUserById,
  selectAllUsers,
  updateUser,
} from "../store/slices/user.slice";
import ConfirmationPopup from "./ConformationPopup";

interface Course {
  courseId: string;
  courseName: string;
  enrolledDate: string;
  duration: string;
  fee: number;
}

interface Student {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "STUDENT";
  name: string;
  isActive?: boolean;
  courses?: Course[];
}

interface CommonCollapsibleTableProps {
  students: Student[];
}

const StudentRow = ({ student }: { student: Student }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = React.useState(false);
  const [switchStatus, setSwitchStatus] = useState(student.isActive);

  const [deletePopup, setDeletePopup] = useState(false);
  const [studentId, setStudentId] = useState<number | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<number>();

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  const handleEdit = ({ id }: { id: number }) => {
    dispatch(fetchUserById({ id: id.toString() })).then(() => {
      dispatch({
        type: "users/openUserModal",
        payload: true,
      });
      dispatch({
        type: "users/isEdit",
        payload: true,
      });
    });
  };

  const handleDelete = ({ id }: { id: number }) => {
    setDeletePopup(true);
    setStudentId(id);
  };

  const handleClosePopup = () => {
    setDeletePopup(false);
    setStudentId(null);
  };

  const handleConfirm = async () => {
    try {
      if (studentId) {
        dispatch(deleteUser({ id: studentId.toString() }));
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      handleClosePopup(); // Close the dialog after API call
    }
  };

  useEffect(() => {
    if (selectedUserId !== undefined) {
      dispatch(updateUser({ id: selectedUserId, isActive: switchStatus }));
    }
  }, [switchStatus, selectedUserId, dispatch]);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{student.firstName}</TableCell>
        <TableCell>{student.lastName}</TableCell>
        <TableCell>{student.email}</TableCell>
        <TableCell>
          <Switch
            {...label}
            checked={switchStatus}
            onChange={(e) => {
              setSwitchStatus(e.target.checked);
              setSelectedUserId(student.id);
            }}
          />
        </TableCell>
        <TableCell align="center">
          {student?.courses && student.courses.length > 0 ? (
            <CheckCircleIcon color="success" />
          ) : (
            <CancelIcon color="error" />
          )}
        </TableCell>
        <TableCell align="right">
          <IconButton
            color="primary"
            onClick={() => handleEdit({ id: +student.id })}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete({ id: +student.id })}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                textAlign={"center"}
                fontWeight={700}
              >
                Enrolled Courses
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Course Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Course Duration
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Enrolled Date
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Fee ($)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {student.courses &&
                    student.courses.map((course) => (
                      <TableRow key={course.courseId}>
                        <TableCell>{course.courseName}</TableCell>
                        <TableCell>{course.duration}</TableCell>
                        <TableCell>{course.enrolledDate}</TableCell>
                        <TableCell align="right">{course.fee}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Delete confirmation */}
      <ConfirmationPopup
        title="Are you sure?"
        description="Do you really want to perform this action?"
        open={deletePopup}
        handleClose={handleClosePopup}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default function CommonCollapsibleTable({
  students,
}: CommonCollapsibleTableProps) {
  const selectStudents = useSelector(selectAllUsers);

  const [studentList, setStudentList] = useState(students);

  useEffect(() => {
    setStudentList(selectStudents);
  }, [selectStudents]);

  return (
    <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
      <Table sx={{ width: "100%", minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ fontWeight: 700 }}>First Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Last Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Active Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Has Enrolled
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentList.map((student) => (
            <StudentRow key={student.id} student={student} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
