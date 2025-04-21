// components/ConfirmationPopup.tsx
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface ConfirmationPopupProps {
  title: string;
  description: string;
  open: boolean;
  handleClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationPopup({
  title,
  description,
  open,
  handleClose,
  onConfirm,
}: ConfirmationPopupProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="confirmation-dialog-title"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary" autoFocus>
          YES
        </Button>
        <Button onClick={handleClose} color="secondary">
          NO
        </Button>
      </DialogActions>
    </Dialog>
  );
}
