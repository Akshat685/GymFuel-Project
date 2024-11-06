import React from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";

const Profile = () => {
  const { username, email   } = useSelector((state) => state.auth);

  // Debugging logs
  console.log('Username:', username); // Check username from Redux state
  console.log('Email:', email); // Check email from Redux state

  // Styled components for custom styling
  const ProfileCard = styled(Card)(() => ({
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    overflow: "visible",
  }));

  const ProfileAvatar = styled(Avatar)(() => ({
    width: "80px",
    height: "80px",
    margin: "auto",
    marginTop: "-40px",
    border: "4px solid white",
    backgroundColor: "#1976d2",
  }));

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <ProfileCard>
        <CardHeader
          title="Profile Information"
          sx={{
            textAlign: "center",
            backgroundColor: "#1976d2",
            color: "white",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            marginBottom: "10px",
          }}
        />
        <CardContent>
          <ProfileAvatar alt={username} src="/path/to/profile-pic.jpg" />
          <Typography variant="h5" align="center" sx={{ mt: 2, mb: 1 }}>
            {username || "No username available"}  {/* Fallback text */}
          </Typography>
          <Divider />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Email:</strong> {email || "No email available"}  {/* Fallback text */}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </ProfileCard>
    </Container>
  );
};

export default Profile;
