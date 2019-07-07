import React from "react"
import {
  Document,
  Section,
  Title,
  Paragraph,
  StrongEmphasis,
  Emphasis,
  InlineLiteral,
  ExternalReference
} from "@rst-js/react"
export default function() {
  return (
    <Document>
      <Section depth={1}>
        <Title>Heading</Title>
        <Paragraph>Paragraph of text.</Paragraph>
        <Section depth={2}>
          <Title>Inline markup</Title>
          <Paragraph>
            <StrongEmphasis>bold</StrongEmphasis> <Emphasis>italic</Emphasis>{" "}
            <InlineLiteral>literal</InlineLiteral>{" "}
            <ExternalReference>phrase reference</ExternalReference>
          </Paragraph>
        </Section>
      </Section>
    </Document>
  )
}
