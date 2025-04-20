import { Container } from "@mui/material";
import { ReactNode } from "react";

interface CommonBodyLayoutProps {
  children: ReactNode;
}

const CommonBodyLayout = ({ children }: CommonBodyLayoutProps) => {
  return (
    <Container maxWidth={false} sx={{ px: 3 }}>
      {children}
    </Container>
  );
};

export default CommonBodyLayout;
