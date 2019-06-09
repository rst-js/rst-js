import React from "react"
import { Document, Section, Title } from "@rst-js/react"
import Layout from "./my/layout"
export default function() {
  return (
    <Layout>
      <Document>
        <Section depth={1}>
          <Title>Heading</Title>
        </Section>
      </Document>
    </Layout>
  )
}
