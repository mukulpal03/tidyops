"use client";

import React from "react";
import { useDataStore } from "@/store/dataStore";
import { PrioritizationWeights } from "@/types";
import {
  FaBalanceScale,
  FaClock,
  FaDollarSign,
  FaStar,
  FaUsers,
  FaCog,
} from "react-icons/fa";

export default function PrioritizationPanel() {
  const { prioritizationWeights, updatePrioritizationWeight } = useDataStore();

  const weightConfigs = [
    {
      key: "priorityLevel" as keyof PrioritizationWeights,
      label: "Priority Level",
      description: "How much to prioritize high-priority clients",
      icon: FaStar,
      color: "text-yellow-600",
    },
    {
      key: "fulfillment" as keyof PrioritizationWeights,
      label: "Request Fulfillment",
      description: "How much to prioritize completing all requested tasks",
      icon: FaUsers,
      color: "text-green-600",
    },
    {
      key: "fairness" as keyof PrioritizationWeights,
      label: "Fair Distribution",
      description: "How much to ensure fair workload distribution",
      icon: FaBalanceScale,
      color: "text-blue-600",
    },
    {
      key: "efficiency" as keyof PrioritizationWeights,
      label: "Resource Efficiency",
      description: "How much to optimize resource utilization",
      icon: FaCog,
      color: "text-purple-600",
    },
    {
      key: "cost" as keyof PrioritizationWeights,
      label: "Cost Optimization",
      description: "How much to minimize operational costs",
      icon: FaDollarSign,
      color: "text-red-600",
    },
    {
      key: "speed" as keyof PrioritizationWeights,
      label: "Speed of Execution",
      description: "How much to prioritize faster task completion",
      icon: FaClock,
      color: "text-orange-600",
    },
  ];

  const presetProfiles = [
    {
      name: "Maximize Fulfillment",
      description: "Prioritize completing all client requests",
      weights: {
        priorityLevel: 40,
        fulfillment: 80,
        fairness: 30,
        efficiency: 50,
        cost: 20,
        speed: 40,
      },
    },
    {
      name: "Fair Distribution",
      description: "Ensure balanced workload across workers",
      weights: {
        priorityLevel: 30,
        fulfillment: 50,
        fairness: 80,
        efficiency: 40,
        cost: 30,
        speed: 30,
      },
    },
    {
      name: "Minimize Workload",
      description: "Reduce worker stress and burnout",
      weights: {
        priorityLevel: 20,
        fulfillment: 40,
        fairness: 70,
        efficiency: 60,
        cost: 40,
        speed: 20,
      },
    },
    {
      name: "Cost Optimized",
      description: "Minimize operational costs",
      weights: {
        priorityLevel: 30,
        fulfillment: 50,
        fairness: 40,
        efficiency: 70,
        cost: 80,
        speed: 30,
      },
    },
  ];

  const handlePresetClick = (weights: PrioritizationWeights) => {
    Object.entries(weights).forEach(([key, value]) => {
      updatePrioritizationWeight(key as keyof PrioritizationWeights, value);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Prioritization & Weights
      </h2>

      {/* Preset Profiles */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Presets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {presetProfiles.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset.weights)}
              className="p-4 border border-gray-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors text-left"
            >
              <h4 className="font-semibold text-gray-900 mb-1">
                {preset.name}
              </h4>
              <p className="text-sm text-gray-600">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Weights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Custom Weights
        </h3>
        <div className="space-y-6">
          {weightConfigs.map((config) => {
            const Icon = config.icon;
            const currentValue = prioritizationWeights[config.key];

            return (
              <div key={config.key} className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Icon className={`text-lg ${config.color}`} />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {config.label}
                    </label>
                    <p className="text-xs text-gray-500">
                      {config.description}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
                    {currentValue}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentValue}
                    onChange={(e) =>
                      updatePrioritizationWeight(
                        config.key,
                        parseInt(e.target.value)
                      )
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        updatePrioritizationWeight(
                          config.key,
                          Math.max(0, currentValue - 10)
                        )
                      }
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      -10
                    </button>
                    <button
                      onClick={() =>
                        updatePrioritizationWeight(
                          config.key,
                          Math.min(100, currentValue + 10)
                        )
                      }
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">
          Current Configuration
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {weightConfigs.map((config) => (
            <div key={config.key} className="flex justify-between">
              <span className="text-gray-600">{config.label}:</span>
              <span className="font-medium">
                {prioritizationWeights[config.key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
