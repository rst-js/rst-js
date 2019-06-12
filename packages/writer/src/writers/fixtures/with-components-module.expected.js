import React from "react"
import { Document, Section, Title, Paragraph } from "ui-lib"
export default function() {
  return (
    <Document>
      <Section depth={1}>
        <Title>Section</Title>
        <Paragraph>Paragraph</Paragraph>
      </Section>
    </Document>
  )
}
