import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  School as CoursesIcon,
  Book as EnrollmentsIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

const drawerWidth = 240;

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const studentItems = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
    { text: "Courses", icon: <CoursesIcon />, path: "/courses" },
    { text: "My Enrollments", icon: <EnrollmentsIcon />, path: "/enrollments" },
  ];

  const adminItems = [
    { text: "Admin Dashboard", icon: <HomeIcon />, path: "/admin" },
    { text: "Manage Courses", icon: <CoursesIcon />, path: "/admin/courses" },
    { text: "Manage Students", icon: <AdminIcon />, path: "/admin/students" },
    {
      text: "Manage Enrollments",
      icon: <EnrollmentsIcon />,
      path: "/admin/enrollments",
    },
  ];

  const items = user?.role === "ADMIN" ? adminItems : studentItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname.startsWith(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
