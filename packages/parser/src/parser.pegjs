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

   function showCurrentLocation(message = 'Current location:') {
      const loc = location()
      const lines = input.split('\n')

      return [
         message,
         '',
         lines.slice(loc.start.line - 3, loc.start.line).join("⏎\n") + "⏎",
         `${" ".repeat(loc.start.column - 1)}^`,
         lines.slice(loc.start.line, loc.start.line + 3).join("⏎\n"),
      ].join("\n")
   }

   function _error(message) {
      error(showCurrentLocation(message))
   }

   function debug() {
      console.log(showCurrentLocation())
   }
}

// Remove leading/trailing whitespace in the document
// and process children.
Document =
   Blankline*
   firstChild:DocumentElement?
   children:(Blankline+ DocumentElement)*
   Blankline* Whitespace* Eof
   {
      if (firstChild == null) return tokens.document([])

      return tokens.document([firstChild, ...mapByIndex(children, 1)])
   }

Debug = &(. / !.
   &{
      debug()
      return true
   }
)

// Top-level document elements
DocumentElement
   = Section
   / BodyElement

BodyElement =
   FieldList /
   Directive /
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
Newline "Newline" = '\n' / last:('\r' '\n'?) { return last[0] + (last[1] || ''); }

Whitespace "Whitespace" = ' ' / '\v' / '\f' / '\t'

NormalizedToWhitespace = Whitespace / Newline

IgnoreWhitespace = Whitespace*

Blankline "BlankLine" = IgnoreWhitespace Newline

Lastline = IgnoreWhitespace Endline

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

// I's possible to split paragraph to multiple lines but only if following
// line starts with expected indent.
ParagraphLine = BlockIndent text:InlineMarkup+ { return text }

Paragraph =
   firstChild:ParagraphLine
   children:(Blankline ExpectedIndent ParagraphLine)*
   {
      const lines = R.flatten([firstChild, ...mapByIndex(children, 2)])
      return tokens.paragraph(concatTexts(lines))
   }

FieldList = firstChild:Field fields:(Blankline ExpectedIndent Field)*
   {
      return tokens.fieldList([firstChild, ...mapByIndex(fields, 2)])
   }

Field = BlockIndent ':' name:[^:]+ ':' Whitespace+ children:InlineMarkup+
   {
      return tokens.field(name.join(""), children)
   }

Directive =
   BlockIndent
   directive:(
      DirectiveWithEverything /
      DirectiveWithOptions /
      DirectiveWithContent /
      DirectiveOneLine
   )
   { return directive }

DirectiveWithEverything =
   name:DirectiveName args:DirectiveArguments? Blankline
   PushIndent
   options:DirectiveOptions Blankline
   Blankline+
   content:DirectiveContent
   PullIndent
   {
      return tokens.directive(name, args, options, content)
   }

DirectiveWithContent =
   name:DirectiveName args:DirectiveArguments? Blankline
   Blankline*
   PushIndent
   content:DirectiveContent
   PullIndent
   {
      return tokens.directive(name, args, null, content)
   }

DirectiveWithOptions =
   name:DirectiveName args:DirectiveArguments? Blankline
   PushIndent
   options:DirectiveOptions
   PullIndent
   {
      return tokens.directive(name, args, options, null)
   }

DirectiveOneLine = name:DirectiveName args:DirectiveArguments?
   {
      return tokens.directive(name, args)
   }


DoubleColon = "::"

DirectiveName = ".. " name:(!DoubleColon .)+ DoubleColon
   {
      return mapByIndex(name, 1).join("")
   }

DirectiveArguments = Whitespace+ args:InlineMarkup*
   {
      return args
   }

DirectiveOptions = fields:FieldList
   {
      return fields.children
   }

DirectiveContent =
   firstChild:BodyElement
   children:(Blankline+ ExpectedIndent BodyElement)*
   {
      return [firstChild, ...mapByIndex(children, 2)]
   }

// Sections
Section =
   title:Title
   children:(Blankline+ !IsNextSection DocumentElement)*
   {
      const depth = document.popSection()
      return tokens.section(depth, [title, ...mapByIndex(children, 2)])
   }

IsNextSection = &(
   over:(line:SectionLine Blankline { return line })?
   line:(IgnoreWhitespace InlineMarkup+ Blankline)
   under:SectionLine Blankline?
   &{
      if (over != null && over !== under) return false

      return !document.isSubSection(under[0], over != null)
   }
)

Title "Title" =
   over:(line:SectionLine Blankline { return line })?
   IgnoreWhitespace children:InlineMarkup+ Blankline
   under:SectionLine Blankline?
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

// Indent
PushIndent = &(indent:Whitespace+
   {
      document.pushIndent(indent.length)
      return true
   })


PullIndent = &(Blankline* indent:Whitespace*
   &{
      if (!indent.length) {
         document.clearIndent()
      } else {
         document.pullIndent(indent.length)
      }
      return true
   })

ExpectedIndent "ExpectedIndent" = &(indent:Whitespace*
   &{
      return document.getCurrentIndent() === indent.length
   })

BlockIndent "BlockIndent" = indent:Whitespace*
   &{
      if (document.getCurrentIndent() !== indent.length) {
         _error(`Unexpected indent - ${document.getCurrentIndent()} spaces were expected, got ${indent.length}.`)
      }

      return true
   }
