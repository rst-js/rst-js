import React from "react"
import { Document } from "@rst-js/react"
import { Section, Heading } from "components/rst"
import Paragraph from "ui-lib/Text"
export default function() {
  return (
    <Document>
      <Section depth={1}>
        <Heading>Section</Heading>
        <Paragraph>Paragraph</Paragraph>
      </Section>
    </Document>
  )
}
