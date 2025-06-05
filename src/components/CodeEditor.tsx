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
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">Python Editor</span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full overflow-auto">
          <CodeMirror
            value={code}
            theme={oneDark}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: true,
            }}
            extensions={[
              python(),
              history(),
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
            style={{
              fontSize: "14px",
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};
