import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap } from "@codemirror/search";
import {
  completionKeymap,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { foldKeymap } from "@codemirror/language";
import type { CodeEditorProps } from "../types";

const getLanguageExtension = (language?: string) => {
  switch (language?.toLowerCase()) {
    case "html":
      return html();
    case "css":
      return css();
    case "js":
    case "javascript":
      return javascript();
    case "json":
      return json();
    case "md":
    case "markdown":
      return markdown();
    case "py":
    case "python":
      return python();
    case "c":
    case "cpp":
    case "c++":
      return cpp();
    default:
      return python(); // Default to Python for backward compatibility
  }
};

export const CodeEditor = ({ code, onChange, language }: CodeEditorProps) => {
  const languageExtension = getLanguageExtension(language);

  return (
    <div className="h-full flex flex-col">
      {/* <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">Python Editor</span>
        </div>
      </div> */}

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
              languageExtension,
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
