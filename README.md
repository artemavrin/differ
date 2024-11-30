# Differ

Differ is a VS Code extension that helps developers create better commit messages using artificial intelligence.


## Features

- Automatic generation of meaningful commit messages based on code changes
- Support for multiple AI providers:
  - OpenAI and OpenAI-compatible APIs (like Azure OpenAI)
  - Anthropic and Claude-compatible APIs
  - xAI
- Support for self-hosted and alternative AI models that are compatible with OpenAI/Anthropic APIs
- Customizable instructions for message generation
- Seamless integration with Git in VS Code
- Multiple AI model management

## How to Use

1. Add an AI model using the "Differ: Add new model" command
2. Select your active model with "Differ: Select current model"
3. When making a commit, use the "Generate Commit Message" button in the Source Control panel
4. The generated message will automatically appear in the commit input field

## Configuration

You can specify additional instructions for commit message generation in the extension settings, such as language or format preferences.

## Supported Models

- Any OpenAI-compatible models (including self-hosted alternatives like LocalAI)
- Any Anthropic Claude-compatible models
- Custom API endpoints that implement OpenAI/Anthropic-compatible interfaces
- xAI models

## Requirements

- Git
- Access to your chosen AI provider's API (OpenAI/Anthropic/xAI or compatible)
- VS Code version 1.95.0 or higher

## Commands

This extension provides the following commands:

* `Differ: Add new model` - Add a new AI model configuration. You'll need to provide:
  - Provider type (OpenAI, Anthropic, xAI)
  - Model name
  - API endpoint (optional, for custom deployments)
  - API key

* `Differ: Select current model` - Choose which configured model to use for generating commit messages

* `Differ: Remove model` - Remove a previously configured AI model

* `Generate Commit Message` - Generate a commit message based on current changes (available in Source Control panel)

This extension significantly simplifies the process of writing informative commit messages, helping maintain clean and understandable repository history.

## Extension Settings

This extension contributes the following settings:

* `differ.instructions`: Additional instructions for commit message generation (default: "Use English language")
