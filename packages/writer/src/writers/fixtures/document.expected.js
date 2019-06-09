import React from "react"
import { Document, Section, Title, Paragraph } from "@rst-js/react"
export default function() {
  return (
    <Document>
      <Section depth={1}>
        <Title>Heading</Title>
        <Paragraph>Paragraph of text.</Paragraph>
        <Section depth={2}>
          <Title>Title</Title>
        </Section>
      </Section>
    </Document>
  )
}
