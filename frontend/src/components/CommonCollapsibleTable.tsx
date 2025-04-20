// components/CommonCollapsibleTable.tsx
import React from "react";
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

function StudentRow({ student }: { student: Student }) {
  const [open, setOpen] = React.useState(false);

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  const handleEdit = ({ id }: { id: number }) => {
    console.log(`Edit user with ID ${id}`);
  };

  const handleDelete = ({ id }: { id: number }) => {
    console.log(`Delete user with ID ${id}`);
  };

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
          <Switch {...label} defaultChecked />
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
    </>
  );
}

export default function CommonCollapsibleTable({
  students,
}: CommonCollapsibleTableProps) {
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
          {students.map((student) => (
            <StudentRow key={student.id} student={student} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
