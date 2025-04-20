import { Container } from "@mui/material";
import { ReactNode } from "react";

interface CommonBodyLayoutProps {
  children: ReactNode;
}

const CommonBodyLayout = ({ children }: CommonBodyLayoutProps) => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {children}
    </Container>
  );
};

export default CommonBodyLayout;
