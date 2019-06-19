{
   const R = require("ramda")
   const tokens = require("./tokens")
   const { Document } = require("./document")

   const document = new Document()
   const mapByIndex = (children, index) => R.map(R.prop(index), children)

   const concatTexts = tokens => {
      const newTokens = []
      for (const token of tokens) {
         const lastIndex = newTokens.length - 1
         if (newTokens[lastIndex] != null && newTokens[lastIndex].type === "text" && token.type === "text") {
            let value = newTokens[lastIndex].value

            if (value[value.length - 1] !== " " && token.value[0] !== " ") {
               value += " "
            }

            newTokens[lastIndex].value = value + token.value
         } else {
            newTokens.push(token)
         }
      }

      return newTokens
   }
}

// Remove leading/trailing whitespace in the document
// and process children.
Document =
   Blankline*
   children:DocumentElement*
   Blankline*
   Lastline
   {
      return tokens.document(children)
   }

// Top-level document elements
DocumentElement
   = Section
   / BodyElement

BodyElement =
   Paragraph

InlineMarkup "InlineMarkup" =
   StrongEmphasis /
   Emphasis /
   InternalReference /
   ExternalReference /
   FootnoteReference /
   SubstitutionReference /
   InterpretedText /
   InlineLiteral /
   Text

// Common
Newline = '\n' / last:('\r' '\n'?) { return last[0] + (last[1] || ''); }

Whitespace = ' ' / '\v' / '\f' / '\t'

NormalizedToWhitespace = Whitespace / Newline

Blankline "BlankLine" = Whitespace* Newline

Lastline = Whitespace* Endline

Blanklines = Blankline Blankline+

Eof = !.

Endline = Newline / Eof

// Inline Markup

Text = children:InlineMarkupText {
   return tokens.text(children)
}

InlineMarkupText "InlineMarkupText" = text:(!Lastline !InlineMarkupStartString !InlineMarkupEndString (EscapedMarkupStartString / .))+ {
   return mapByIndex(text, 3).join("").replace(/\s+/g, " ")
}

EscapedMarkupStartString = EscapeChar char:InlineMarkupStartString {
   return char
}

InlineMarkupStartString =
   StrongEmphasisStart /
   EmphasisStart /
   ExternalReferenceStart /
   FootnoteReferenceStart /
   SubstitutionReferenceStart /
   InlineLiteralStart /
   InterpretedTextStart

InlineMarkupEndString =
   StrongEmphasisEnd /
   EmphasisEnd /
   ExternalReferenceEnd /
   FootnoteReferenceEnd /
   SubstitutionReferenceEnd /
   InlineLiteralEnd /
   InterpretedTextEnd

EscapeChar = '\\'

EmphasisStart = '*'
EmphasisEnd = EmphasisStart

StrongEmphasisStart = '**'
StrongEmphasisEnd = StrongEmphasisStart

InterpretedTextStart = '`'
InterpretedTextEnd = InterpretedTextStart

InlineLiteralStart = '``'
InlineLiteralEnd = InlineLiteralStart

SubstitutionReferenceStart = '|'
SubstitutionReferenceEnd = SubstitutionReferenceStart

InternalReferenceStart = '_`'
InternalReferenceEnd = '`'

FootnoteReferenceStart = '['
FootnoteReferenceEnd = ']_'

ExternalReferenceStart = '`'
ExternalReferenceEnd = '`_'

Emphasis =
  !EscapeChar
  EmphasisStart
  text:InlineMarkupText
  (EmphasisEnd / &{ error("Emphasis isn't terminated.") })
  {
    return tokens.emphasis([tokens.text(text)])
  }

StrongEmphasis =
  !EscapeChar
  StrongEmphasisStart
  text:InlineMarkupText
  (StrongEmphasisEnd / &{ error("Strong emphasis isn't terminated.") })
  {
    return tokens.strongEmphasis([tokens.text(text)])
  }

InterpretedText =
  !EscapeChar
  InterpretedTextStart
  text:InlineMarkupText
  (InterpretedTextEnd / &{ error("Interprered text isn't terminated.") })
  {
    return tokens.interpretedText([tokens.text(text)])
  }

InlineLiteral =
  !EscapeChar
  InlineLiteralStart
  text:InlineMarkupText
  (InlineLiteralEnd / &{ error("Literal isn't terminated.") })
  {
    return tokens.inlineLiteral([tokens.text(text)])
  }

SubstitutionReference =
  !EscapeChar
  SubstitutionReferenceStart
  text:InlineMarkupText
  (SubstitutionReferenceEnd / &{ error("Substitution reference isn't terminated.") })
  {
    return tokens.substitutionReference([tokens.text(text)])
  }

InternalReference =
  !EscapeChar
  InternalReferenceStart
  text:InlineMarkupText
  (InternalReferenceEnd / &{ error("Reference isn't terminated.") })
  {
    return tokens.internalReference([tokens.text(text)])
  }

ExternalReference =
  !EscapeChar
  ExternalReferenceStart
  text:InlineMarkupText
  ExternalReferenceEnd
  {
    return tokens.externalReference([tokens.text(text)])
  }

FootnoteReference =
  !EscapeChar
  FootnoteReferenceStart
  text:InlineMarkupText
  (FootnoteReferenceEnd / &{ error("Footnote reference isn't terminated.") })
  {
    return tokens.footnoteReference([tokens.text(text)])
  }

// Block Markup

Paragraph =
   children:(Whitespace* InlineMarkup+ Blankline?)+
   Blankline*
   {
      const flatTokens = R.flatten(mapByIndex(children, 1))
      return tokens.paragraph(concatTexts(flatTokens))
   }

// Sections
Section =
   title:Title
   children:((IsSubSection Section) / (!IsSection BodyElement))*
   Blankline*
   {
      const depth = document.popSection()
      return tokens.section(depth, [title, ...mapByIndex(children, 1)])
   }

IsSection = &(
   SectionLine Blankline
   Whitespace* InlineMarkup+ Blankline
   SectionLine Blankline?
) / &(
   Whitespace* InlineMarkup+ Blankline
   SectionLine Blankline?
)

IsSubSection = &(
   over:(o:SectionLine Blankline { return o })?
   line:(Whitespace* InlineMarkup+ Blankline)
   under:SectionLine Blankline?
   &{
      if (over != null && over[0] !== under[0]) return false

      return document.isSubSection(under[0], over != null)
   }
)

Title "Title" =
   over:(o:SectionLine Blankline { return o })?
   Whitespace* children:InlineMarkup+ Blankline
   under:SectionLine Blankline*
   {
      if (over != null && over !== under) error("Section overline must match underline")

      document.addSection(under[0], over != null)
      return tokens.title(children)
   }

SectionLine "SectionLine" =
  line:[!#$%&()*+,-./:=;><?@[\]^_`}|{~"']+

  // Check that line is made from the same characters
  & { return R.uniq(line).length === 1 }

  { return line.join('') }
