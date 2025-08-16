import React, { useState, useEffect } from "react";
import { Theme, Button, Flex, Text, Callout } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Score, Optimize, HistoryEntry } from "../lib/schema";
import { scorePromptViaBg, optimizePromptViaBg } from "../lib/messages";
import {
  saveWorkingState,
  loadWorkingState,
  saveHistory,
  loadHistory,
  getKey,
} from "../lib/storage";

// Components
import PromptEditor from "./components/PromptEditor";
import ScorePanel from "./components/ScorePanel";
import ImprovedPanel from "./components/ImprovedPanel";
import HistoryList from "./components/HistoryList";
import Toolbar from "./components/Toolbar";
import LoadingAnimation from "./components/LoadingAnimation";
import Toast from "./components/Toast";

const Popup: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [originalScore, setOriginalScore] = useState<Score | undefined>();
  const [improvedPrompt, setImprovedPrompt] = useState<string>("");
  const [improvedScore, setImprovedScore] = useState<Score | undefined>();
  const [optimizeResult, setOptimizeResult] = useState<Optimize | undefined>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true);
  const [error, setError] = useState<string>("");

  // Loading states
  const [isScoring, setIsScoring] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    loadInitialState();
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const key = await getKey();
      setApiKeyConfigured(!!key);
    } catch (error) {
      setApiKeyConfigured(false);
    }
  };

  const loadInitialState = async () => {
    try {
      // Load working state
      const workingState = await loadWorkingState();
      if (workingState) {
        setPrompt(workingState.prompt);
        setOriginalScore(workingState.currentScore);
        setImprovedPrompt(workingState.improved || "");
        setImprovedScore(workingState.improvedScore);
      }

      // Load history
      const historyData = await loadHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load initial state:", error);
    }
  };

  const handleScore = async () => {
    if (!prompt.trim()) {
      setError("Paste a prompt first");
      return;
    }

    setIsScoring(true);
    setError("");

    try {
      const score = await scorePromptViaBg(prompt.trim());
      setOriginalScore(score);

      // Save working state
      await saveWorkingState({
        prompt: prompt.trim(),
        currentScore: score,
        improved: improvedPrompt,
        improvedScore: improvedScore,
      });

      // Save to history
      const entry: HistoryEntry = {
        original: prompt.trim(),
        originalScore: score,
        improved: improvedPrompt || undefined,
        improvedScore: improvedScore,
        timestamp: Date.now(),
      };
      await saveHistory(entry);
      const updatedHistory = await loadHistory();
      setHistory(updatedHistory);
    } catch (error) {
      console.error("Score error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to score prompt"
      );
    } finally {
      setIsScoring(false);
    }
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      setError("Paste a prompt first");
      return;
    }

    setIsOptimizing(true);
    setError("");

    try {
      const result = await optimizePromptViaBg(prompt.trim());
      setOptimizeResult(result);
      setImprovedPrompt(result.improved_prompt);

      // Automatically score the improved prompt
      try {
        const newScore = await scorePromptViaBg(result.improved_prompt);
        setImprovedScore(newScore);
      } catch (scoreError) {
        console.error("Failed to score improved prompt:", scoreError);
      }

      // Save working state
      await saveWorkingState({
        prompt: prompt.trim(),
        currentScore: originalScore,
        improved: result.improved_prompt,
        improvedScore: improvedScore,
      });

      // Save to history
      const entry: HistoryEntry = {
        original: prompt.trim(),
        originalScore: originalScore,
        improved: result.improved_prompt,
        improvedScore: improvedScore,
        timestamp: Date.now(),
      };
      await saveHistory(entry);
      const updatedHistory = await loadHistory();
      setHistory(updatedHistory);
    } catch (error) {
      console.error("Optimize error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to optimize prompt"
      );
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: `${label} copied!`, type: "success" });
    } catch (error) {
      console.error("Failed to copy:", error);
      setToast({ message: "Failed to copy", type: "error" });
    }
  };

  const handlePresetSelect = (preset: string) => {
    setPrompt(preset);
  };

  const handleClear = () => {
    setPrompt("");
    setOriginalScore(undefined);
    setImprovedPrompt("");
    setImprovedScore(undefined);
    setOptimizeResult(undefined);
    setError("");
  };

  const handleHistoryLoad = (
    entry: HistoryEntry,
    which: "original" | "improved"
  ) => {
    if (which === "original") {
      setPrompt(entry.original);
      setOriginalScore(entry.originalScore);
    } else if (which === "improved" && entry.improved) {
      setPrompt(entry.improved);
      setOriginalScore(entry.improvedScore);
    }
    setImprovedPrompt("");
    setImprovedScore(undefined);
    setOptimizeResult(undefined);
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const isLoading = isScoring || isOptimizing;

  return (
    <Theme
      appearance="dark"
      accentColor="violet"
      grayColor="slate"
      radius="medium"
      scaling="95%"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        :root {
            --primary-purple: #6366f1;
            --secondary-purple: #8b5cf6;
            --accent-pink: #ec4899;
            --accent-cyan: #06b6d4;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --text-readable: #e2e8f0;
            --text-muted: #94a3b8;
            --background-primary: #0f172a;
            --background-secondary: #1e293b;
        }
        
        body {
            background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            width: 400px;
            height: 600px;
            overflow: hidden;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .popup-container {
          width: 400px;
          height: 600px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          position: relative;
          overflow: hidden;
        }
        
        .popup-content {
          height: 100%;
          overflow-y: auto;
          padding: 20px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        
        .popup-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .popup-content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .popup-content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
        
        .popup-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .header-title {
          background: linear-gradient(135deg, var(--accent-cyan), var(--primary-purple), var(--accent-pink));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 28px;
          margin-bottom: 4px;
          text-align: center;
          letter-spacing: -0.5px;
        }
        
        .glassmorphic {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          backdrop-filter: blur(20px);
        }
        
        .tab-container {
          display: flex;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 3px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .tab-button {
          flex: 1;
          padding: 10px 14px;
          border: none;
          border-radius: 9px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .tab-button.active {
          background: linear-gradient(135deg, var(--primary-purple), var(--secondary-purple));
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .tab-button.inactive {
          background: transparent;
          color: var(--text-secondary);
        }
        
        .tab-button.inactive:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }
        
        .tab-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .input-container {
          margin-bottom: 16px;
        }
        
        .input-label {
          color: var(--text-readable);
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
          display: block;
        }
        
        .prompt-textarea {
          width: 100%;
          min-height: 100px;
          max-height: 160px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          line-height: 1.4;
          resize: vertical;
          font-family: inherit;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        
        .prompt-textarea:focus {
          outline: none;
          border-color: var(--primary-purple);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .prompt-textarea::placeholder {
          color: var(--text-muted);
        }
        
        .button-group {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }
        
        .action-button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .action-button.score {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }
        
        .action-button.score:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }
        
        .action-button.optimize {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        
        .action-button.optimize:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        }
        
        .copy-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, var(--primary-purple), var(--secondary-purple));
          color: white;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        
        .copy-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
        }
        
        .back-button {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .back-button:hover {
          background: rgba(255, 255, 255, 0.15);
          color: var(--text-primary);
        }
        
        .content-display {
          padding: 16px;
          margin-bottom: 16px;
          max-height: 180px;
          overflow-y: auto;
          line-height: 1.6;
          font-size: 14px;
          white-space: pre-wrap;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        
        .content-display::-webkit-scrollbar {
          width: 4px;
        }
        
        .content-display::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
        
        .settings-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 8px;
          background: rgba(255,255,255,0.08);
          color: var(--text-secondary);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px;
          font-family: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: auto;
          margin-bottom: 0;
        }
        
        .settings-button:hover {
          background: rgba(255,255,255,0.12);
          color: var(--text-primary);
        }
      `}</style>
      <div className="popup-container">
        <div className="popup-content">
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          <Flex direction="column" gap="4" style={{ height: "100%" }}>
            {/* Header */}
            <Flex
              direction="column"
              align="center"
              gap="2"
              style={{ marginBottom: "16px" }}
            >
              <h1 className="header-title">PromptHero</h1>
              <Text
                size="2"
                style={{ color: "var(--text-secondary)", textAlign: "center" }}
              >
                AI Prompt Optimizer
              </Text>
            </Flex>

            {/* API Key Warning */}
            {!apiKeyConfigured && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginBottom: "12px",
                  fontSize: "13px",
                  color: "#fca5a5",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⚠️ API key not configured.</span>
                <button
                  onClick={openOptions}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(252, 165, 165, 0.5)",
                    borderRadius: "4px",
                    color: "#fca5a5",
                    padding: "2px 6px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Open Options
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginBottom: "12px",
                  fontSize: "13px",
                  color: "#fca5a5",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="tab-container">
              <button
                className={`tab-button ${
                  !improvedPrompt ? "active" : "inactive"
                }`}
                onClick={() => setImprovedPrompt("")}
              >
                📝 Original Prompt
              </button>
              <button
                className={`tab-button ${
                  improvedPrompt ? "active" : "inactive"
                }`}
                disabled={!improvedPrompt}
              >
                ⚡ Optimized Result
              </button>
            </div>

            {!improvedPrompt ? (
              <>
                {/* Original Prompt Tab */}
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      color: "var(--text-readable)",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    Enter your AI prompt:
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Example: Write a story about a robot learning to feel emotions..."
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        minHeight: "100px",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        lineHeight: "1.4",
                        resize: "vertical",
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{ display: "flex", gap: "8px", marginBottom: "12px" }}
                >
                  <button
                    onClick={handleScore}
                    disabled={!prompt.trim() || isLoading || !apiKeyConfigured}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor:
                        !prompt.trim() || isLoading || !apiKeyConfigured
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        !prompt.trim() || isLoading || !apiKeyConfigured
                          ? 0.5
                          : 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    📊 Score Prompt
                  </button>
                  <button
                    onClick={handleOptimize}
                    disabled={!prompt.trim() || isLoading || !apiKeyConfigured}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor:
                        !prompt.trim() || isLoading || !apiKeyConfigured
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        !prompt.trim() || isLoading || !apiKeyConfigured
                          ? 0.5
                          : 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    ⚡ Optimize Prompt
                  </button>
                </div>

                {/* Score Display */}
                <ScorePanel title="Prompt Score" score={originalScore} />
              </>
            ) : (
              <>
                {/* Optimized Result Tab */}
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      color: "var(--text-readable)",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    Improved Prompt:
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px",
                      maxHeight: "140px",
                      overflowY: "auto",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {improvedPrompt}
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      color: "var(--text-readable)",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    What was improved:
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px",
                      maxHeight: "120px",
                      overflowY: "auto",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {optimizeResult?.checklist?.join("\n\n") ||
                      "Optimization details will appear here."}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(improvedPrompt, "Improved prompt")}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background:
                      "linear-gradient(135deg, var(--primary-purple), var(--secondary-purple))",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  📋 Copy to Clipboard
                </button>

                <button
                  onClick={() => setImprovedPrompt("")}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "var(--text-secondary)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  ← Back to Original
                </button>
              </>
            )}

            {/* Loading Animation - Center Overlay */}
            {(isScoring || isOptimizing) && (
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(0,0,0,0.9)",
                  borderRadius: "12px",
                  padding: "30px 40px",
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(15px)",
                  zIndex: 9999,
                  minWidth: "200px",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 16px",
                    background: isScoring
                      ? "linear-gradient(45deg, #3b82f6, #1d4ed8)"
                      : "linear-gradient(45deg, #10b981, #059669)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: isScoring
                      ? "spin 2s linear infinite"
                      : "pulse 1.5s ease-in-out infinite",
                  }}
                >
                  <Text size="8" weight="bold" style={{ color: "white" }}>
                    {isScoring ? "📊" : "⚡"}
                  </Text>
                </div>
                <Text
                  size="3"
                  weight="medium"
                  style={{
                    color: "white",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  {isScoring
                    ? "Analyzing your prompt..."
                    : "Creating your improved prompt..."}
                </Text>
                <Text size="2" style={{ color: "#888" }}>
                  {isScoring
                    ? "This might take a few seconds"
                    : "Processing with Gemini AI"}
                </Text>
              </div>
            )}

            {/* Settings Access */}
            <div
              style={{
                paddingBottom: "8px",
              }}
            >
              <button
                onClick={openOptions}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "rgba(255,255,255,0.08)",
                  color: "var(--text-secondary)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "12px",
                }}
              >
                ⚙️ API Settings
              </button>
            </div>
          </Flex>
        </div>
      </div>
    </Theme>
  );
};

export default Popup;
