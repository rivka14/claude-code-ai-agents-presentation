# AI Agents Presentation

A presentation about AI Agents generated via Claude Code,              
showcasing the capabilities and best practices for using Claude's command-line coding assistant.

## What is Claude Code?

Claude Code is a command-line tool that allows developers to delegate coding tasks directly to Claude from their terminal.                
It enables seamless collaboration between developers and AI for various programming tasks.

[Claude Code Getting Started](https://docs.anthropic.com/en/docs/claude-code/getting-started)

## Best Practices 

### 1. Use claude.md Files
Create a claude.md file in your project root to provide context about your project:

Project Context:
This is a presentation about AI Agents, Also add steps on how to work correctly.

### 2. Use Plan Mode
Use plan mode to break down complex tasks:                  
claude-code --plan with shift+tab "Create a presentation about AI Agents with the images attached with 7 slides"

This helps Claude understand the scope and structure before implementation.

### 3. Include Screenshots for Design & Debugging
When working on UI/UX or debugging:
- Take screenshots of designs you want to implement
- Capture error messages or unexpected behavior
- Include these images in your prompts for more accurate assistance

### 4. Additional Tips
- **Be specific**: Provide clear, detailed instructions
- **Iterate**: Start with basic functionality, then refine
- **Context matters**: Keep your claude.md updated with project changes
- **Use examples**: Show Claude what you want with concrete examples
