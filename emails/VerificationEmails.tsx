import {
  Html,
  Head,
  Font,
  Preview,
  Row,
  Section,
  Text,
  Button,
  Container,
  Img,
  Column,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  const appName = "MysteryMsg";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mysterymsg.com";
  const currentYear = new Date().getFullYear();

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>{`Verify Your Email - ${appName}`}</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily={["Arial", "sans-serif"]}
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Your {appName} verification code: {otp}
      </Preview>

      <Container style={container}>
        <Section style={header}>
          <Row>
            <Column style={logoContainer}>
              <Img
                src={`${appUrl}/favicon.jpg`}
                width="48"
                height="48"
                alt={appName}
                style={logo}
              />
              <Text style={appNameText}>{appName}</Text>
            </Column>
          </Row>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Hello {username},</Text>
          <Text style={paragraph}>
            Thank you for registering with {appName}! To complete your
            registration, please verify your email address by entering the
            following verification code:
          </Text>

          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>

          <Text style={paragraph}>
            This code will expire in 1 hour. If you didn't request this email,
            you can safely ignore it.
          </Text>

          <Button href={`${appUrl}/verify/${username}`} style={button}>
            Verify Email Address
          </Button>

          {/* <Text style={smallText}>
            Or verify using this link:
            <a href={`${appUrl}/verify/${username}`} style={link}>
              Verify Me
            </a>
          </Text> */}
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            &copy; {currentYear} {appName}. All rights reserved.
          </Text>
          {/* <Row style={socialContainer}>
            <a href={appUrl} style={socialLink}>
              <Img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/twitter.svg"
                width="20"
                height="20"
                alt="Twitter"
                style={socialIcon}
              />
            </a>
            <a href={appUrl} style={socialLink}>
              <Img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/facebook.svg"
                width="20"
                height="20"
                alt="Facebook"
                style={socialIcon}
              />
            </a>
            <a href={appUrl} style={socialLink}>
              <Img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/instagram.svg"
                width="20"
                height="20"
                alt="Instagram"
                style={socialIcon}
              />
            </a>
          </Row> */}
          <Text style={footerSmallText}>
            You're receiving this email because you signed up for a {appName}{" "}
            account. If you didn't make this request, you can safely ignore this
            email.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

export async function getVerificationEmailHtml(username: string, otp: string) {
  const { render } = await import('@react-email/render');
  return render(<VerificationEmail username={username} otp={otp} />, { pretty: true });
}
// Styles
const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  fontFamily: '"Inter", Arial, sans-serif',
  color: "#1a1a1a",
  lineHeight: "1.6",
};

const header = {
  padding: "24px 0",
  textAlign: "center" as const,
  borderBottom: "1px solid #eaeaea",
};

const logoContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
};

const logo = {
  marginRight: "12px",
};

const appNameText = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#1a1a1a",
  margin: 0,
  background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const content = {
  padding: "32px",
};

const greeting = {
  fontSize: "24px",
  fontWeight: 600,
  margin: "0 0 24px 0",
  color: "#1a1a1a",
};

const paragraph = {
  fontSize: "16px",
  margin: "0 0 24px 0",
  color: "#4b5563",
  lineHeight: "1.6",
};

const codeContainer = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "32px 0",
  border: "1px solid #e2e8f0",
};

const code = {
  fontSize: "40px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: "#1a1a1a",
  margin: 0,
  background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const button = {
  backgroundColor: "#4f46e5",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
  width: "100%",
  maxWidth: "200px",
};

const smallText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "24px 0 0 0",
  lineHeight: "1.5",
};

const link = {
  color: "#4f46e5",
  textDecoration: "none",
  wordBreak: "break-all" as const,
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
  borderTop: "1px solid #eaeaea",
  backgroundColor: "#f9fafb",
  borderRadius: "0 0 8px 8px",
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 16px 0",
};

const socialContainer = {
  display: "flex",
  justifyContent: "center",
  margin: "16px 0",
  padding: 0,
};

const socialLink = {
  display: "inline-block",
  margin: "0 12px",
  color: "#6b7280",
  textDecoration: "none",
};

const socialIcon = {
  width: "20px",
  height: "20px",
  opacity: 0.7,
  transition: "opacity 0.2s",
};

const footerSmallText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "16px 0 0 0",
  lineHeight: "1.5",
};
