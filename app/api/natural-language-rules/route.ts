import { NextResponse, NextRequest } from "next/server";
import { BusinessRule } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { prompt, clients, workers, tasks } = await request.json();

    console.log("Natural language rule request:", {
      prompt,
      dataCounts: {
        clients: clients.length,
        workers: workers.length,
        tasks: tasks.length,
      },
    });

    const lowerPrompt = prompt.toLowerCase();

    // Parse different rule types from natural language
    let rule: Partial<BusinessRule> | null = null;

    // Co-run rules
    if (
      lowerPrompt.includes("run together") ||
      lowerPrompt.includes("co-run") ||
      lowerPrompt.includes("concurrent")
    ) {
      const taskMatches = prompt.match(/(?:task|tasks?)\s+([A-Z0-9,\s]+)/gi);
      if (taskMatches) {
        const taskIds = taskMatches
          .flatMap((match: string) =>
            match.replace(/task\s*/gi, "").split(/[,\s]+/)
          )
          .filter((id: string) => id.trim().length > 0)
          .map((id: string) => id.trim().toUpperCase());

        rule = {
          type: "coRun",
          name: `Co-run ${taskIds.join(", ")}`,
          description: `Tasks ${taskIds.join(", ")} must run together`,
          enabled: true,
          priority: 5,
          config: {
            taskIDs: taskIds,
          },
        };
      }
    }

    // Load limit rules
    else if (
      lowerPrompt.includes("load limit") ||
      lowerPrompt.includes("max load") ||
      lowerPrompt.includes("workload")
    ) {
      const workerGroupMatch = prompt.match(
        /(?:worker group|group)\s+([A-Za-z]+)/i
      );
      const maxLoadMatch = prompt.match(/(\d+)\s*(?:slots?|tasks?|load)/i);

      if (workerGroupMatch && maxLoadMatch) {
        const workerGroup = workerGroupMatch[1];
        const maxLoad = parseInt(maxLoadMatch[1]);

        rule = {
          type: "loadLimit",
          name: `Load Limit for ${workerGroup}`,
          description: `Limit ${workerGroup} workers to ${maxLoad} slots per phase`,
          enabled: true,
          priority: 4,
          config: {
            workerGroup,
            maxSlotsPerPhase: maxLoad,
          },
        };
      }
    }

    // Phase window rules
    else if (
      lowerPrompt.includes("phase") &&
      (lowerPrompt.includes("window") ||
        lowerPrompt.includes("allowed") ||
        lowerPrompt.includes("restrict"))
    ) {
      const taskMatch = prompt.match(/(?:task|tasks?)\s+([A-Z0-9]+)/i);
      const phaseMatch = prompt.match(/(?:phase|phases?)\s*([0-9,\-\s]+)/i);

      if (taskMatch && phaseMatch) {
        const taskId = taskMatch[1].toUpperCase();
        const phaseText = phaseMatch[1];

        // Parse phase ranges like "1-3" or lists like "1,2,3"
        let allowedPhases: number[] = [];
        if (phaseText.includes("-")) {
          const [start, end] = phaseText
            .split("-")
            .map((p: string) => parseInt(p.trim()));
          if (!isNaN(start) && !isNaN(end)) {
            allowedPhases = Array.from(
              { length: end - start + 1 },
              (_, i) => start + i
            );
          }
        } else {
          allowedPhases = phaseText
            .split(/[,\s]+/)
            .map((p: string) => parseInt(p.trim()))
            .filter((p: number) => !isNaN(p));
        }

        rule = {
          type: "phaseWindow",
          name: `Phase Window for ${taskId}`,
          description: `Task ${taskId} can only run in phases ${allowedPhases.join(
            ", "
          )}`,
          enabled: true,
          priority: 3,
          config: {
            taskID: taskId,
            allowedPhases,
          },
        };
      }
    }

    // Slot restriction rules
    else if (
      lowerPrompt.includes("slot") &&
      (lowerPrompt.includes("restriction") ||
        lowerPrompt.includes("common") ||
        lowerPrompt.includes("minimum"))
    ) {
      const groupMatch = prompt.match(
        /(?:group|client group|worker group)\s+([A-Za-z]+)/i
      );
      const minSlotsMatch = prompt.match(/(\d+)\s*(?:common slots?|minimum)/i);

      if (groupMatch && minSlotsMatch) {
        const groupName = groupMatch[1];
        const minSlots = parseInt(minSlotsMatch[1]);
        const groupType = lowerPrompt.includes("client") ? "client" : "worker";

        rule = {
          type: "slotRestriction",
          name: `Slot Restriction for ${groupName}`,
          description: `${groupType} group ${groupName} requires minimum ${minSlots} common slots`,
          enabled: true,
          priority: 4,
          config: {
            groupType,
            groupName,
            minCommonSlots: minSlots,
          },
        };
      }
    }

    // Pattern match rules
    else if (
      lowerPrompt.includes("pattern") ||
      lowerPrompt.includes("regex") ||
      lowerPrompt.includes("match")
    ) {
      const regexMatch = prompt.match(/(?:regex|pattern)\s+([^\s]+)/i);
      const templateMatch = prompt.match(/(?:template|rule)\s+([A-Za-z]+)/i);

      if (regexMatch) {
        const regex = regexMatch[1];
        const template = templateMatch ? templateMatch[1] : "default";

        rule = {
          type: "patternMatch",
          name: `Pattern Match: ${regex}`,
          description: `Apply pattern matching with regex ${regex}`,
          enabled: true,
          priority: 2,
          config: {
            regex,
            ruleTemplate: template,
            parameters: {},
          },
        };
      }
    }

    // Precedence override rules
    else if (
      lowerPrompt.includes("precedence") ||
      lowerPrompt.includes("priority") ||
      lowerPrompt.includes("override")
    ) {
      const globalRulesMatch = prompt.match(
        /(?:global rules?|rules?)\s+([A-Za-z,\s]+)/i
      );

      if (globalRulesMatch) {
        const globalRules = globalRulesMatch[1]
          .split(/[,\s]+/)
          .filter((r: string) => r.trim().length > 0);

        rule = {
          type: "precedenceOverride",
          name: "Precedence Override",
          description: `Override precedence with global rules: ${globalRules.join(
            ", "
          )}`,
          enabled: true,
          priority: 1,
          config: {
            globalRules,
            specificRules: [],
          },
        };
      }
    }

    if (rule) {
      // Add unique ID
      rule.id = Date.now().toString();

      console.log("Generated rule:", rule);

      return NextResponse.json({
        success: true,
        rule,
        message: "Rule generated successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message:
          "Could not parse rule from natural language. Please try a different format.",
        suggestions: [
          "Try: 'Tasks T1 and T2 must run together'",
          "Try: 'Limit Senior workers to 3 slots per phase'",
          "Try: 'Task T3 can only run in phases 1-3'",
          "Try: 'VIP clients need minimum 2 common slots'",
        ],
      });
    }
  } catch (error) {
    console.error("Error processing natural language rule:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing request",
      },
      { status: 500 }
    );
  }
}
