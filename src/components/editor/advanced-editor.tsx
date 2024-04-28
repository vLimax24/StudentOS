"use client"
import React, { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorInstance,
  EditorCommandList,
} from "novel"
import { ImageResizer, handleCommandNavigation } from "novel/extensions"
import { defaultExtensions } from "./extensions"
import { slashCommand, suggestionItems } from "./slash-command"
import { handleImageDrop, handleImagePaste } from "novel/plugins"
import { uploadFn } from "./image-upload"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Separator } from "@/components/ui/separator"
import { NodeSelector } from "./selectors/node-selector"
import { LinkSelector } from "./selectors/link-selector"
import { TextButtons } from "./selectors/text-buttons"
import { ColorSelector } from "./selectors/color-selector"
import GenerativeMenuSwitch from "./generative-menu-switch"


const extensions = [...defaultExtensions, slashCommand]

const TailwindAdvancedEditor = ({ textContent, docId }:any) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null,
  )
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openAI, setOpenAI] = useState(false)

  const [saveStatus, setSaveStatus] = useState("Saved")
  const updateDocument = useMutation(api.documents.updateContent)
  

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON()

        await updateDocument({
            documentId: docId,
            newContent: json
        })
        console.log("Content updated ran successfully")
        setSaveStatus("Saved")
    },
      
    500,
  )

  useEffect(() => {
    setInitialContent(textContent)
  }, [textContent])

  if (!initialContent) return null

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
        {saveStatus}
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-[500px] w-full max-w-screen-lg bg-transparent sm:mb-[calc(20vh)] sm:rounded-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor)
            setSaveStatus("Unsaved")
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item:any) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val:any) => item?.command(val)}
                  className={"flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent "}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>

        </EditorContent>
      </EditorRoot>
    </div>
  )
}

export default TailwindAdvancedEditor
