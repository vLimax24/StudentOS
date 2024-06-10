import { ReactRenderer } from "@tiptap/react"
import { Editor } from "@tiptap/core"
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion"
import tippy, { Instance } from "tippy.js"

import EmojiList from "./components/EmojiList"

export const emojiSuggestion = {
  items: ({ editor, query }: { editor: Editor; query: string }) =>
    editor.storage.emoji.emojis
      .filter(
        ({ shortcodes, tags }: { shortcodes: string[]; tags: string[] }) =>
          shortcodes.find(shortcode =>
            shortcode.startsWith(query.toLowerCase())
          ) || tags.find(tag => tag.startsWith(query.toLowerCase()))
      )
      .slice(0, 250),

  allowSpaces: false,

  render: () => {
    let component: any
    let popup: any

    return {
      onStart: (props: SuggestionProps<any>) => {
        component = new ReactRenderer(EmojiList, {
          props,
          editor: props.editor,
        })

        popup = tippy(document.body, {
          getReferenceClientRect: props.clientRect as () =>
            | DOMRect
            | ClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        })
      },

      onUpdate(props: SuggestionProps<any>) {
        component.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () =>
            | DOMRect
            | ClientRect,
        })
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === "Escape") {
          popup[0].hide()
          component.destroy()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}

export default emojiSuggestion
