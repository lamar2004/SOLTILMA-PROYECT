import { Outlet } from "react-router-dom";
import HeaderPrincipal from "../components/HeaderPrincipal";
import Footer from "../components/Footer";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderPrincipal />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
