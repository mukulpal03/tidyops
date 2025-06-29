"use client";

import React, { useState } from "react";
import { useDataStore } from "@/store/dataStore";
import { BusinessRule, ClientData, WorkerData, TaskData } from "@/types";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaMagic,
  FaSpinner,
} from "react-icons/fa";

interface BusinessRulesPanelProps {
  clients: ClientData[];
  workers: WorkerData[];
  tasks: TaskData[];
}

export default function BusinessRulesPanel({
  clients,
  workers,
  tasks,
}: BusinessRulesPanelProps) {
  const {
    businessRules,
    addBusinessRule,
    updateBusinessRule,
    removeBusinessRule,
  } = useDataStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNaturalLanguage, setShowNaturalLanguage] = useState(false);
  const [editingRule, setEditingRule] = useState<BusinessRule | null>(null);
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState("");
  const [isGeneratingRule, setIsGeneratingRule] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    type: "coRun" as BusinessRule["type"],
    name: "",
    description: "",
    enabled: true,
    priority: 1,
    config: {} as any,
  });

  const handleAddRule = () => {
    const newRule: BusinessRule = {
      id: Date.now().toString(),
      ...ruleForm,
    };
    addBusinessRule(newRule);
    setShowAddForm(false);
    setRuleForm({
      type: "coRun",
      name: "",
      description: "",
      enabled: true,
      priority: 1,
      config: {},
    });
  };

  const handleEditRule = (rule: BusinessRule) => {
    setEditingRule(rule);
    setRuleForm({
      type: rule.type,
      name: rule.name,
      description: rule.description,
      enabled: rule.enabled,
      priority: rule.priority,
      config: rule.config,
    });
  };

  const handleUpdateRule = () => {
    if (editingRule) {
      updateBusinessRule(editingRule.id, ruleForm);
      setEditingRule(null);
      setRuleForm({
        type: "coRun",
        name: "",
        description: "",
        enabled: true,
        priority: 1,
        config: {},
      });
    }
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    updateBusinessRule(ruleId, { enabled });
  };

  const handleNaturalLanguageRule = async () => {
    if (!naturalLanguagePrompt.trim()) return;

    setIsGeneratingRule(true);
    try {
      const response = await fetch("/api/natural-language-rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: naturalLanguagePrompt,
          clients,
          workers,
          tasks,
        }),
      });

      const result = await response.json();

      if (result.success && result.rule) {
        addBusinessRule(result.rule as BusinessRule);
        setNaturalLanguagePrompt("");
        setShowNaturalLanguage(false);
      } else {
        alert(result.message || "Failed to generate rule");
      }
    } catch (error) {
      console.error("Error generating rule:", error);
      alert("Error generating rule. Please try again.");
    } finally {
      setIsGeneratingRule(false);
    }
  };

  const renderRuleConfig = () => {
    switch (ruleForm.type) {
      case "coRun":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Task IDs (comma-separated)
            </label>
            <input
              type="text"
              value={ruleForm.config.taskIDs?.join(", ") || ""}
              onChange={(e) =>
                setRuleForm({
                  ...ruleForm,
                  config: {
                    ...ruleForm.config,
                    taskIDs: e.target.value.split(",").map((id) => id.trim()),
                  },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="T1, T2, T3"
            />
          </div>
        );

      case "slotRestriction":
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Group Type
              </label>
              <select
                value={ruleForm.config.groupType || "client"}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    config: {
                      ...ruleForm.config,
                      groupType: e.target.value as "client" | "worker",
                    },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="client">Client Group</option>
                <option value="worker">Worker Group</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                value={ruleForm.config.groupName || ""}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    config: { ...ruleForm.config, groupName: e.target.value },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="VIP, Senior, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Common Slots
              </label>
              <input
                type="number"
                value={ruleForm.config.minCommonSlots || 1}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    config: {
                      ...ruleForm.config,
                      minCommonSlots: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
          </div>
        );

      case "loadLimit":
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Worker Group
              </label>
              <input
                type="text"
                value={ruleForm.config.workerGroup || ""}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    config: { ...ruleForm.config, workerGroup: e.target.value },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Senior, Junior, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Slots Per Phase
              </label>
              <input
                type="number"
                value={ruleForm.config.maxSlotsPerPhase || 1}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    config: {
                      ...ruleForm.config,
                      maxSlotsPerPhase: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
          </div>
        );

      case "phaseWindow":
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task ID
              </label>
              <select
                value={ruleForm.config.taskID || ""}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    config: { ...ruleForm.config, taskID: e.target.value },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a task</option>
                {tasks.map((task) => (
                  <option key={task.TaskID} value={task.TaskID}>
                    {task.TaskID} - {task.TaskName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allowed Phases (comma-separated)
              </label>
              <input
                type="text"
                value={ruleForm.config.allowedPhases?.join(", ") || ""}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    config: {
                      ...ruleForm.config,
                      allowedPhases: e.target.value
                        .split(",")
                        .map((phase) => parseInt(phase.trim()))
                        .filter((phase) => !isNaN(phase)),
                    },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="1, 2, 3"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Business Rules</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowNaturalLanguage(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaMagic className="text-sm" />
            <span>AI Rule</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <FaPlus className="text-sm" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {/* Natural Language Rule Form */}
      {showNaturalLanguage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-green-800">
            Create Rule with Natural Language
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your rule in plain English
              </label>
              <textarea
                value={naturalLanguagePrompt}
                onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
                placeholder="e.g., 'Tasks T1 and T2 must run together' or 'Limit Senior workers to 3 slots per phase'"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">
                Example formats:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• "Tasks T1 and T2 must run together"</li>
                <li>• "Limit Senior workers to 3 slots per phase"</li>
                <li>• "Task T3 can only run in phases 1-3"</li>
                <li>• "VIP clients need minimum 2 common slots"</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleNaturalLanguageRule}
                disabled={isGeneratingRule || !naturalLanguagePrompt.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300"
              >
                {isGeneratingRule ? (
                  <FaSpinner className="text-sm animate-spin" />
                ) : (
                  <FaMagic className="text-sm" />
                )}
                <span>
                  {isGeneratingRule ? "Generating..." : "Generate Rule"}
                </span>
              </button>
              <button
                onClick={() => {
                  setShowNaturalLanguage(false);
                  setNaturalLanguagePrompt("");
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Rule Form */}
      {(showAddForm || editingRule) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingRule ? "Edit Rule" : "Add New Rule"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rule Type
              </label>
              <select
                value={ruleForm.type}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    type: e.target.value as BusinessRule["type"],
                    config: {},
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="coRun">Co-Run Tasks</option>
                <option value="slotRestriction">Slot Restriction</option>
                <option value="loadLimit">Load Limit</option>
                <option value="phaseWindow">Phase Window</option>
                <option value="patternMatch">Pattern Match</option>
                <option value="precedenceOverride">Precedence Override</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rule Name
              </label>
              <input
                type="text"
                value={ruleForm.name}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter rule name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={ruleForm.description}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter rule description"
              />
            </div>

            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <input
                  type="number"
                  value={ruleForm.priority}
                  onChange={(e) =>
                    setRuleForm({
                      ...ruleForm,
                      priority: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  max="10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={ruleForm.enabled}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, enabled: e.target.checked })
                  }
                  className="rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Enabled
                </label>
              </div>
            </div>

            {renderRuleConfig()}

            <div className="flex space-x-2">
              <button
                onClick={editingRule ? handleUpdateRule : handleAddRule}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                {editingRule ? "Update Rule" : "Add Rule"}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRule(null);
                  setRuleForm({
                    type: "coRun",
                    name: "",
                    description: "",
                    enabled: true,
                    priority: 1,
                    config: {},
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-4">
        {businessRules.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No business rules defined. Add your first rule to get started.
          </p>
        ) : (
          businessRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 border rounded-lg ${
                rule.enabled
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                    <span className="px-2 py-1 text-xs bg-violet-100 text-violet-800 rounded">
                      {rule.type}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Priority: {rule.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {rule.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Config: {JSON.stringify(rule.config)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {rule.enabled ? (
                      <FaToggleOn className="text-green-500 text-lg" />
                    ) : (
                      <FaToggleOff className="text-gray-400 text-lg" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => removeBusinessRule(rule.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
