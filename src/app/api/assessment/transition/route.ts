import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, ticketTitle, rootCause, keyChanges, qaSteps } = body;

    if (!ticketId || !rootCause || !keyChanges || !qaSteps) {
      return NextResponse.json(
        { error: 'All 3 resolution bullet points are required.' },
        { status: 400 }
      );
    }

    const promptsFilePath = path.join(process.cwd(), 'PROMPTS.md');
    
    // Format resolution section
    const timestamp = new Date().toISOString();
    const resolutionMarkdown = `

---

### 🎫 Jira Resolution Note: ${ticketId} - ${ticketTitle}
*Transitioned to DONE at:* \`${timestamp}\`

* **1. Root Cause Analysis:**
  ${rootCause.trim()}

* **2. Key Changes & Architectural Trade-offs:**
  ${keyChanges.trim()}

* **3. QA Verification & Testing Instructions:**
  ${qaSteps.trim()}
`;

    // Append to PROMPTS.md
    if (fs.existsSync(promptsFilePath)) {
      fs.appendFileSync(promptsFilePath, resolutionMarkdown, 'utf-8');
    } else {
      fs.writeFileSync(promptsFilePath, `# Candidate Notes\n${resolutionMarkdown}`, 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: `Ticket ${ticketId} transitioned to DONE and appended to PROMPTS.md`,
    });
  } catch (error) {
    console.error('Failed to record Jira transition:', error);
    return NextResponse.json(
      { error: 'Internal server error while saving Jira transition.' },
      { status: 500 }
    );
  }
}
