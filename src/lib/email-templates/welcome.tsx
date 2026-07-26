import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface WelcomeProps {
  name?: string;
}

const Email = ({ name }: WelcomeProps) => {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You showed up. That matters.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Even Me</Heading>
          <Text style={text}>{greeting}</Text>
          <Text style={text}>
            Thank you for subscribing. This little space is for you — not your
            child, not your to-do list. Just you.
          </Text>
          <Section style={card}>
            <Text style={cardTitle}>How it works</Text>
            <Text style={cardText}>
              • 90 seconds a day. That's it.<br />
              • Pick what today felt like, get a small reset, hear a "me too."<br />
              • No streak shame — just a soft record you showed up.
            </Text>
          </Section>
          <Text style={text}>
            You're doing more than anyone sees. We're glad you're here.
          </Text>
          <Text style={signoff}>— The Even Me team</Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: "Welcome to Even Me",
  displayName: "Welcome email",
  previewData: { name: "Sam" },
} satisfies TemplateEntry;

const main: React.CSSProperties = {
  backgroundColor: "#ffffff",
  fontFamily:
    'Nunito, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  color: "#3a2e28",
  padding: "24px 0",
};
const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "24px",
};
const h1: React.CSSProperties = {
  fontFamily: 'Fraunces, Georgia, serif',
  fontSize: "28px",
  fontWeight: 500,
  color: "#8a4a2b",
  margin: "0 0 16px",
};
const text: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};
const card: React.CSSProperties = {
  backgroundColor: "#f6efe6",
  borderRadius: "16px",
  padding: "20px",
  margin: "20px 0",
};
const cardTitle: React.CSSProperties = {
  fontFamily: 'Fraunces, Georgia, serif',
  fontSize: "18px",
  color: "#5a6b4e",
  margin: "0 0 8px",
};
const cardText: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  margin: 0,
  color: "#3a2e28",
};
const signoff: React.CSSProperties = {
  fontSize: "14px",
  color: "#7a6b62",
  marginTop: "24px",
};
