import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import {
  foldGutter,
  indentOnInput,
  bracketMatching,
  foldKeymap,
} from "@codemirror/language";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/view";
import { Code } from "lucide-react";
import type { CodeEditorProps } from "../types";

export const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div className="flex-1 flex flex-col max-h-screen overflow-y-auto">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">Python Editor</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={[
            python(),
            lineNumbers(),
            highlightActiveLineGutter(),
            history(),
            foldGutter(),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            highlightSelectionMatches(),
            keymap.of([
              ...defaultKeymap,
              ...searchKeymap,
              ...historyKeymap,
              ...foldKeymap,
              ...completionKeymap,
              ...closeBracketsKeymap,
            ]),
          ]}
          onChange={onChange}
          className="h-full"
        />
      </div>
    </div>
  );
};
