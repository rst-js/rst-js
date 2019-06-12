import React from "react"
import {
  Document,
  Section,
  Title,
  Paragraph,
  Strong,
  Emphasis,
  Literal,
  Reference,
  BulletList,
  ListItem,
  EnumeratedList,
  DefinitionList,
  DefinitionListItem,
  Term,
  Definition,
  LiteralBlock,
  BlockQuote,
  Transition
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
            <Strong>bold</Strong> <Emphasis>italic</Emphasis>{" "}
            <Literal>literal</Literal> <Reference>reference</Reference>{" "}
            <Reference>phrase reference</Reference>{" "}
            <Reference>anonymous</Reference>
          </Paragraph>
        </Section>
        <Section depth={2}>
          <Title>Lists</Title>
          <BulletList bullet="-">
            <ListItem>
              <Paragraph>Item</Paragraph>
            </ListItem>
            <ListItem>
              <Paragraph>Item</Paragraph>
              <BulletList bullet="-">
                <ListItem>
                  <Paragraph>Nested</Paragraph>
                  <BulletList bullet="-">
                    <ListItem>
                      <Paragraph>Nested</Paragraph>
                    </ListItem>
                  </BulletList>
                </ListItem>
              </BulletList>
            </ListItem>
          </BulletList>
          <EnumeratedList>
            <ListItem>
              <Paragraph>First item</Paragraph>
            </ListItem>
            <ListItem>
              <Paragraph>Second item</Paragraph>
              <EnumeratedList>
                <ListItem>
                  <Paragraph>nested</Paragraph>
                  <EnumeratedList>
                    <ListItem>
                      <Paragraph>nested</Paragraph>
                    </ListItem>
                  </EnumeratedList>
                </ListItem>
              </EnumeratedList>
            </ListItem>
          </EnumeratedList>
          <DefinitionList>
            <DefinitionListItem>
              <Term>term</Term>
              <Definition>
                <Paragraph>definition</Paragraph>
              </Definition>
            </DefinitionListItem>
          </DefinitionList>
        </Section>
        <Section depth={2}>
          <Title>Blocks</Title>
          <Paragraph>
            A paragraph containing only two colons indicates the following
            indented or quoted text is a literal block or quoted text is a
            literal block.
          </Paragraph>
          <LiteralBlock>
            Whitespace, newlines, blank lines, and all kinds ofmarkup (like
            *this* or \this) is preserved here.
          </LiteralBlock>
          <Paragraph>
            You can also tack the <Literal>::</Literal> at the end of a
            paragraph
          </Paragraph>
          <LiteralBlock>It's very convenient to use this form.</LiteralBlock>
          <Paragraph>
            Per-line quoting can also be used for unindented blocks
          </Paragraph>
          <LiteralBlock>
            > Useful for quotes from email and> for Haskell literate
            programming.
          </LiteralBlock>
          <Paragraph>Block quotes are just:</Paragraph>
          <BlockQuote>
            <Paragraph>Indented paragraphs,</Paragraph>
            <BlockQuote>
              <Paragraph>and they may nest.</Paragraph>
            </BlockQuote>
          </BlockQuote>
          <Paragraph>
            A transition marker is a horizontal line of 4 or more repeated
            punctuation characters.
          </Paragraph>
          <Transition />
        </Section>
      </Section>
    </Document>
  )
}
